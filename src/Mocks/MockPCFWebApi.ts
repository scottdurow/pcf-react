/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockPCFWebApi implements ComponentFramework.WebApi {
  createRecord(
    entityType: string,
    data: ComponentFramework.WebApi.Entity,
  ): Promise<ComponentFramework.EntityReference> {
    throw new Error("Method not implemented.");
  }
  deleteRecord(entityType: string, id: string): Promise<ComponentFramework.EntityReference> {
    throw new Error("Method not implemented.");
  }
  updateRecord(
    entityType: string,
    id: string,
    data: ComponentFramework.WebApi.Entity,
  ): Promise<ComponentFramework.EntityReference> {
    throw new Error("Method not implemented.");
  }
  retrieveMultipleRecords(
    entityType: string,
    options?: string | undefined,
    maxPageSize?: number | undefined,
  ): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
    throw new Error("Method not implemented.");
  }
  retrieveRecord(
    entityType: string,
    id: string,
    options?: string | undefined,
  ): Promise<ComponentFramework.WebApi.Entity> {
    throw new Error("Method not implemented.");
  }
}
