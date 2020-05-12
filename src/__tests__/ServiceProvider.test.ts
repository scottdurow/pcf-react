import { ControlContextService } from "../ControlContextService";

test("OnLoad Event", async () => {
  const contextService = new ControlContextService();
  let onLoaded = false;
  contextService.onLoadEvent.subscribe(async () => {
    onLoaded = true;
  });
  contextService.onLoadEvent.dispatch(contextService);
  expect(onLoaded).toBe(true);
});

test("OnSave Event", async () => {
  const contextService = new ControlContextService();
  let onSaved = false;
  contextService.onSaveEvent.subscribe(async () => {
    onSaved = true;
  });
  contextService.onSaveEvent.dispatch(contextService, {
    primaryId: {
      entityType: "account",
      id: "123",
    },
  });
  expect(onSaved).toBe(true);
});

test("OnClose Fullscreen Event", async () => {
  const contextService = new ControlContextService();
  let onClosed = false;
  contextService.onFullScreenModeChangedEvent.subscribe(async () => {
    onClosed = true;
  });
  contextService.onFullScreenModeChangedEvent.dispatch(contextService, true);
  expect(onClosed).toBe(true);
});
