/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockPCFDevice implements ComponentFramework.Device {
  captureAudio(): Promise<ComponentFramework.FileObject> {
    throw new Error("Method not implemented.");
  }
  captureImage(
    _options?: ComponentFramework.DeviceApi.CaptureImageOptions | undefined,
  ): Promise<ComponentFramework.FileObject> {
    throw new Error("Method not implemented.");
  }
  captureVideo(): Promise<ComponentFramework.FileObject> {
    throw new Error("Method not implemented.");
  }
  getBarcodeValue(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getCurrentPosition(): Promise<ComponentFramework.DeviceApi.Position> {
    throw new Error("Method not implemented.");
  }
  pickFile(
    _options?: ComponentFramework.DeviceApi.PickFileOptions | undefined,
  ): Promise<ComponentFramework.FileObject[]> {
    throw new Error("Method not implemented.");
  }
}
