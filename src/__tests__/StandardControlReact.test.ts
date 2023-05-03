import { StandardControlReact } from "../StandardControlReact";
import { MockPCFContext } from "../Mocks/MockPCFContext";
import { ControlContextService } from "../ControlContextService";

test("OnLoad Event", async () => {
  const renderDelegate = jest.fn();
  var reactCreateElement = renderDelegate;

  const control = new StandardControlReact(reactCreateElement);

  const mockContext = new MockPCFContext();
  mockContext.mode.trackContainerResize = jest.fn();
  const notifyCallback = jest.fn();
  control.init(mockContext, notifyCallback, {});

  const controlContext = control.serviceProvider.get<ControlContextService>(ControlContextService.serviceProviderName);

  const onload = jest.fn();
  controlContext.onLoadEvent.subscribe(onload);

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
