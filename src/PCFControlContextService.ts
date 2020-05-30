/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ControlContextService } from "./ControlContextService";
import { DatasetStateManager } from "./DatasetStateManager";
import { DateBehavior } from "./DateBehavior";
import { PCFPropertyBagStateManager } from "./PropertyBagState";
export class PCFControlContextService extends ControlContextService {
  private isFullScreen = false;
  private loaded = false;
  private context: ComponentFramework.Context<unknown>;
  private parameters: Record<string, unknown> = {};
  private dataset?: ComponentFramework.PropertyTypes.DataSet;
  private parameterState: PCFPropertyBagStateManager;
  private datasetState: DatasetStateManager;
  private notifyOutputChangedCallback: () => void;
  private datasetColumnsAdded = false;
  private datasetColumns?: string[];
  private emmitDebug = false;
  public datasetName = "dataset";
  constructor(
    context: ComponentFramework.Context<unknown>,
    notifyOutputChangedCallback: () => void,
    emmitDebug?: boolean,
  ) {
    super();
    this.emmitDebug = emmitDebug ?? false;
    this.notifyOutputChangedCallback = notifyOutputChangedCallback;
    this.context = context;
    this.parameterState = new PCFPropertyBagStateManager((d) => this.convertToLocalDate(d));
    this.datasetState = new DatasetStateManager();
  }
  getPrimaryId(): Xrm.LookupValue {
    const formContext = this.getFormContext();
    return {
      id: formContext.mode.contextInfo.entityId,
      entityType: formContext.mode.contextInfo.entityTypeName,
    };
  }
  debug(message: string): void {
    if (this.emmitDebug) {
      console.debug(message);
    }
  }
  getIsFullScreen(): boolean {
    return this.isFullScreen;
  }
  fullScreen(fullscreen: boolean): void {
    this.isFullScreen = fullscreen;
    this.context.mode.setFullScreen(fullscreen);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFormContext(): any {
    // Getting the entityId and entityName in Model Driven Apps isn't technically supported yet
    // You can bind a text parameter to the entityID - but you don't get the logical name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.context as any;
  }

  onInit(context: ComponentFramework.Context<unknown>): void {
    this.context = context;
    if (context.parameters) {
      this.onUpdateView(context, Object.keys(context.parameters as Record<string, unknown>));
      if (this.ensureColumns()) {
        this.refreshDataset();
      }
    }
  }
  // Return true when need to redner - property changed or layout
  onUpdateView(
    context: ComponentFramework.Context<unknown>,
    updatedProperties: string[],
  ): { parametersChanged: boolean; layoutChanged: boolean; datasetChanged: boolean } {
    this.context = context;
    this.parameters = this.context.parameters as Record<string, unknown>;
    let updatedPropertiesCorrected = updatedProperties;

    let parametersChanged = false;
    let layoutChanged = false;
    let datasetChanged = false;

    // If we are in the tester or Canvas, we don't get the 'changedParameters'
    if (updatedProperties.length == 0) {
      updatedPropertiesCorrected = Object.keys(this.parameters);
      updatedPropertiesCorrected.push("parameters");
    }

    for (const field of updatedPropertiesCorrected) {
      // Parameters is passed when control is enabled/disabled etc.
      switch (field) {
        case "layout":
          // First time we layout - it's onload
          if (!this.loaded) {
            this.loaded = true;
            this.parameterState.setAllProperties(this.parameters);
            this.onLoadEvent.dispatch(this);
            parametersChanged = true;
          }
          layoutChanged = true;
          break;
        case "viewportSizeMode":
          layoutChanged = true;
          break;
        case this.datasetName:
        case "dataset":
          this.dataset = this.parameters[this.datasetName] as ComponentFramework.PropertyTypes.DataSet;

          // If dataset changed and not already
          if (!datasetChanged && !this.dataset.loading) {
            // Find dataset
            if (this.dataset.records) {
              this.debug(`PCF: dataset ${this.dataset.sortedRecordIds.length} ${this.dataset.records.length}`);
            }

            this.datasetState.setData(this.dataset);
            datasetChanged = true;
            this.onDataChangedEvent.dispatchAsync(this, {
              data: this.getCurrentPage(),
              page: this.datasetState.currentPage,
              pageSize: this.datasetState.getPageSize(),
              totalRecords: this.datasetState.getTotalRecords(),
              totalPages: this.datasetState.getTotalPages(),
            });
          }

          break;
        case "parameters":
          const updated = this.parameterState.getInboundChangedProperties(this.parameters, updatedPropertiesCorrected);
          if (updated && updated.length > 0) {
            this.debug("PCF: updated " + updated);
            this.onParametersChangedEvent.dispatch(this, {
              updated: updated,
              values: this.parameterState.currentValues, // This incudes the corrected dates
            });
            parametersChanged = updated.length > 0;
          }
          break;
        case "entityId":
          this.debug("PCF: onSave");
          // This means the form has been saved so notify
          this.onSaveEvent.dispatch(this, {
            primaryId: this.getPrimaryId(),
          });
          parametersChanged = true;
          break;
        case "fullscreen_open":
          this.debug("PCF: fullscreen_open");
          this.isFullScreen = true;
          layoutChanged = true;
          this.onFullScreenModeChangedEvent.dispatch(this, this.isFullScreen);
          break;
        case "fullscreen_close":
          this.debug("PCF: fullscreen_close");
          this.isFullScreen = false;
          this.onFullScreenModeChangedEvent.dispatch(this, this.isFullScreen);
          layoutChanged = true;
          break;
        case "IsControlDisabled":
          this.onIsControlDisabledChangedEvent.dispatch(this, this.context.mode.isControlDisabled);
          layoutChanged = true;
          break;
      }
    }
    return { parametersChanged: parametersChanged, layoutChanged: layoutChanged, datasetChanged: datasetChanged };
  }

  getParameters<TInput>(): TInput {
    return (this.parameters as unknown) as TInput;
  }
  getValues(): Record<string, unknown> {
    return this.parameterState.currentValues;
  }
  setParameters<TOutput>(values: TOutput): void {
    // Tell PCF that we have changed the parameters and it needs to pull them
    this.parameterState.updateProperties(values);
    this.notifyOutputChangedCallback();
  }
  getOutputs<TOutputs>(): TOutputs {
    this.debug("PCF: getOutputs");
    return this.parameterState.getOutboundChangedProperties<TOutputs>();
  }
  getUserSettings(): ComponentFramework.UserSettings {
    return this.context.userSettings;
  }
  getFormatting(): ComponentFramework.Formatting {
    return this.context.formatting;
  }

  convertToLocalDate(dateProperty: ComponentFramework.PropertyTypes.DateTimeProperty | string | null): Date | null {
    if (dateProperty == null) return null;

    if (typeof dateProperty == "string") {
      // Called from datagrid rows - we don't get the Behavior
      // Assume that this is already a userlocal date - if not this shouldn't be called
      return this.convertDate(new Date(dateProperty as string), "local");
    }

    if (dateProperty.raw == null) return null;
    // If the date is local then we get it in UTC and must change to local
    if (dateProperty.attributes?.Behavior == DateBehavior.UserLocal) {
      return this.convertDate(dateProperty.raw, "local");
    } else return this.getUtcDate(dateProperty.raw);
  }

  private convertDate(value: Date, convertTo: "utc" | "local") {
    let offsetMinutes = this.context.userSettings.getTimeZoneOffsetMinutes(value);

    // The offset returned is the Timezone offset minutes from UTC to Local
    // E.g. Central Time (UTC-6) - getTimeZoneOffsetMinutes will return -360 minutes
    // To get to a utc time we must add 360 (offset)
    // To get to local we must add -360 (offset)
    offsetMinutes = offsetMinutes * (convertTo == "local" ? 1 : -1);
    const localDate = this.addMinutes(value, offsetMinutes);
    return this.getUtcDate(localDate);
  }
  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }
  private getUtcDate(localDate: Date) {
    return new Date(
      localDate.getUTCFullYear(),
      localDate.getUTCMonth(),
      localDate.getUTCDate(),
      localDate.getUTCHours(),
      localDate.getUTCMinutes(),
    );
  }
  openRecord(loicalName: string, id: string): void {
    const version = Xrm.Utility.getGlobalContext().getVersion().split(".");
    const mobile = this.context.client.getClient() == "Mobile";
    // MFD (main form dialog) is available past ["9", "1", "0000", "15631"]
    // But doesn't work on mobile client
    if (
      !mobile &&
      version.length == 4 &&
      Number.parseFloat(version[0] + "." + version[1]) >= 9.1 &&
      Number.parseFloat(version[2] + "." + version[3]) >= 0.15631
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Xrm.Navigation as any).navigateTo(
        {
          entityName: loicalName,
          pageType: "entityrecord",
          formType: 2,
          entityId: id,
        },
        { target: 2, position: 1, width: { value: 80, unit: "%" } },
      );
    } else {
      this.context.navigation.openForm({
        entityName: loicalName,
        entityId: id,
      });
    }
  }
  openNewWindow(url: string): void {
    this.context.navigation.openUrl(url);
  }
  showErrorDialog(ex: Error): Promise<void> {
    const err = new Error();
    return this.context.navigation.openErrorDialog({
      message: ex.message,
      details: JSON.stringify(ex) + ex.stack + err.stack,
    });
  }
  showConfirmDialog(
    confirmStrings: ComponentFramework.NavigationApi.ConfirmDialogStrings,
    options?: ComponentFramework.NavigationApi.ConfirmDialogOptions,
  ): Promise<ComponentFramework.NavigationApi.ConfirmDialogResponse> {
    return this.context.navigation.openConfirmDialog(confirmStrings, options);
  }
  showProgressDialog(message: string): void {
    Xrm.Utility.showProgressIndicator(message);
  }
  closeProgressDialog(): void {
    Xrm.Utility.closeProgressIndicator();
  }

  getDataset(): ComponentFramework.PropertyTypes.DataSet {
    if (!this.dataset) throw new Error("dataset is not loaded");
    return this.dataset;
  }
  applySort(sort: ComponentFramework.PropertyHelper.DataSetApi.SortStatus[], refresh?: boolean): boolean {
    return this.datasetState.appySort(sort, refresh);
  }
  getSort(): ComponentFramework.PropertyHelper.DataSetApi.SortStatus[] {
    if (!this.dataset) throw new Error("dataset is not loaded");
    return this.dataset.sorting;
  }
  getColumns(): ComponentFramework.PropertyHelper.DataSetApi.Column[] {
    if (!this.dataset) throw new Error("dataset is not loaded");
    return this.dataset?.columns;
  }
  nextPage(): void {
    this.datasetState.nextPage();
  }
  previousPage(): void {
    this.datasetState.previousPage();
  }
  nextPageIncremental(): void {
    // In Model Driven Apps - using loadNextPage will incrementally load all the records
    // Useful for infinite scrolling
    this.datasetState.nextPageIncremental();
  }
  refreshDataset(): void {
    this.datasetState.refresh();
  }
  resetPaging(): void {
    this.datasetState.reset();
  }
  setPage(pageNumber: number): void {
    this.datasetState.setPage(pageNumber);
  }
  setPageSize(pageSize: number): void {
    this.datasetState.setPageSize(pageSize);
  }
  getPaging(): {
    pageNumber: number;
    totalPages?: number;
    totalRecords?: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } {
    return {
      pageNumber: this.datasetState.getPageNumber(),
      totalPages: this.datasetState.getTotalPages(),
      hasNextPage: this.datasetState.hasNextPage(),
      hasPreviousPage: this.datasetState.hasPreviousPage(),
      totalRecords: this.datasetState.getTotalRecords(),
    };
  }
  getCurrentPage(): ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] {
    if (!this.dataset) throw new Error("Dataset is not loaded");
    const pageRecords = this.dataset.sortedRecordIds.map((r) => this.dataset?.records[r]);
    return pageRecords as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[];
  }
  setDatasetColumns(logicalName: string[]): void {
    this.datasetColumns = logicalName;
  }
  applyFilter(
    filter?: ComponentFramework.PropertyHelper.DataSetApi.FilterExpression,
    linking?: ComponentFramework.PropertyHelper.DataSetApi.LinkEntityExposedExpression[],
  ): void {
    if (!filter) {
      this.dataset?.filtering.clearFilter();
    } else {
      this.dataset?.filtering.setFilter(filter);

      if (linking) {
        for (const link of linking) {
          this.dataset?.linking.addLinkedEntity(link);
        }
      }
    }
    this.refreshDataset();
  }
  private ensureColumns(): boolean {
    let refreshRequired = false;
    if (this.datasetColumns && !this.datasetColumnsAdded && this.dataset) {
      this.datasetColumnsAdded = true;
      for (const logicalName of this.datasetColumns) {
        refreshRequired = this.ensureColumn(logicalName) || refreshRequired;
      }
    }
    return refreshRequired;
  }
  private ensureColumn(logicalName: string): boolean {
    let added = false;
    if (this.dataset && !this.dataset.columns.find((c) => c.name == logicalName) && this.dataset.addColumn) {
      this.dataset.addColumn(logicalName);
      added = true;
    }
    return added;
  }
}
