/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ReactDOM from "react-dom";
import { ServiceProvider } from "./ServiceProvider";
import { PCFControlContextService } from "./PCFControlContextService";
import { ControlContextService } from "./ControlContextService";

export class StandardControlReact<TInputs, TOutputs> implements ComponentFramework.StandardControl<TInputs, TOutputs> {
  private container!: HTMLDivElement;
  public context!: ComponentFramework.Context<TInputs>;
  public controlContext!: ControlContextService;
  public serviceProvider = new ServiceProvider();
  public renderOnParametersChanged = true;
  public renderOnDatasetChanged = true;
  public renderOnLayoutChanged = true;
  private emmitDebug = false;
  public reactCreateElement?: (
    container: HTMLDivElement,
    width: number | undefined,
    height: number | undefined,
    serviceProvider: ServiceProvider,
  ) => void;
  public initServiceProvider?: (serviceProvider: ServiceProvider) => void;

  constructor(emmitDebug?: boolean) {
    this.emmitDebug = emmitDebug ?? false;
    this.debug("PCF: constructor");
  }
  debug(message: string): void {
    if (this.emmitDebug) {
      console.debug(message);
    }
  }
  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<TInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement,
  ): void {
    this.debug("PCF: init");
    // Add control initialization code
    this.container = container;
    this.context = context;
    this.context.mode.trackContainerResize(true);
    this.serviceProvider = new ServiceProvider();
    this.controlContext = new PCFControlContextService(this.context, notifyOutputChanged);
    this.serviceProvider.register(ControlContextService.serviceProviderName, this.controlContext);

    this.initServiceProvider && this.initServiceProvider(this.serviceProvider);
    this.controlContext.onInit(this.context);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<TInputs>): void {
    try {
      console.debug("PCF: updateView " + JSON.stringify(context.updatedProperties));
      const controlContext = this.getControlContext();
      const updates = controlContext.onUpdateView(context, context.updatedProperties);
      if (
        (this.renderOnLayoutChanged && updates.layoutChanged) ||
        (this.renderOnDatasetChanged && updates.datasetChanged) ||
        (this.renderOnParametersChanged && updates.parametersChanged)
      ) {
        this.renderControl();
      }
    } catch (ex) {
      this.debug(`updateView: ${ex.toString()}`);
      console.error(ex);
    }
  }
  private getControlContext(): ControlContextService {
    return this.serviceProvider.get<ControlContextService>(ControlContextService.serviceProviderName);
  }
  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): TOutputs {
    this.debug("PCF: getOutputs");
    const controlContext = this.getControlContext();
    return controlContext.getOutputs<TOutputs>();
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    this.debug("PCF: destroy");
    ReactDOM.unmountComponentAtNode(this.container);
  }

  private renderControl(): void {
    this.debug(`PCF: renderControl ${this.context.mode.allocatedWidth} x ${this.context.mode.allocatedHeight}`);
    let configuredHeight: number | undefined = undefined;

    // If there is a parameter called height in the manifest, pass it to the the control
    const parametersRecord = (this.context.parameters as unknown) as Record<
      string,
      ComponentFramework.PropertyTypes.Property
    >;
    if (parametersRecord["height"] && parametersRecord["height"].raw) {
      configuredHeight = parametersRecord["height"].raw;
    }

    const width = this.context.mode.allocatedWidth == -1 ? undefined : this.context.mode.allocatedWidth;
    const height = this.context.mode.allocatedHeight == -1 ? configuredHeight : this.context.mode.allocatedHeight;
    if (!this.reactCreateElement) {
      throw new Error(`reactCreateElement delegate must be set`);
    }

    this.reactCreateElement(this.container, width, height, this.serviceProvider);
  }
}
