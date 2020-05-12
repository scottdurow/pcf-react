export class MockPCFClient implements ComponentFramework.Client {
  disableScroll!: boolean;
  getFormFactor(): number {
    throw new Error("Method not implemented.");
  }
  getClient(): string {
    throw new Error("Method not implemented.");
  }
  isOffline(): boolean {
    throw new Error("Method not implemented.");
  }
}
