import { StandardControlReact } from "../StandardControlReact";
import { MockPCFContext } from "../Mocks/MockPCFContext";
import { ControlContextService } from "../ControlContextService";

test("OnLoad Event", async () => {
  const control = new StandardControlReact();

  const mockContext = new MockPCFContext();
  mockContext.mode.trackContainerResize = jest.fn();
  const notifyCallback = jest.fn();
  const element = document.createElement("div");
  control.init(mockContext, notifyCallback, {}, element);

  const controlContext = control.serviceProvider.get<ControlContextService>(ControlContextService.serviceProviderName);

  const onload = jest.fn();
  controlContext.onLoadEvent.subscribe(onload);

  const renderDelegate = jest.fn();
  control.reactCreateElement = renderDelegate;

  // Call first updateView - this is onload
  // Onload should have been called first time update
  mockContext.updatedProperties = ["layout"];
  mockContext.parameters = {};
  control.updateView(mockContext);
  expect(onload).toBeCalledTimes(1);
  expect(control.reactCreateElement).toBeCalledTimes(1);
  expect(true).toBe(true);

  // Onload should not be called second time
  mockContext.updatedProperties = ["layout"];
  mockContext.parameters = {};
  control.updateView(mockContext);
  expect(onload).toBeCalledTimes(1);
  expect(control.reactCreateElement).toBeCalledTimes(2);
});
