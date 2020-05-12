/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockPCFMode implements ComponentFramework.Mode {
  allocatedHeight!: number;
  allocatedWidth!: number;
  isControlDisabled!: boolean;
  isVisible!: boolean;
  label!: string;
  setControlState(state: ComponentFramework.Dictionary): boolean {
    throw new Error("Method not implemented.");
  }
  setFullScreen(value: boolean): void {
    throw new Error("Method not implemented.");
  }
  trackContainerResize(value: boolean): void {
    throw new Error("Method not implemented.");
  }
}
