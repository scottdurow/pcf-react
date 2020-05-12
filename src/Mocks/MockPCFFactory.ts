export class MockPCFFactory implements ComponentFramework.Factory {
  getPopupService(): ComponentFramework.FactoryApi.Popup.PopupService {
    throw new Error("Method not implemented.");
  }
  requestRender(): void {
    throw new Error("Method not implemented.");
  }
}
