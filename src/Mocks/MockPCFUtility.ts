/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockPCFUtility implements ComponentFramework.Utility {
  getEntityMetadata(
    entityName: string,
    attributes?: string[] | undefined,
  ): Promise<ComponentFramework.PropertyHelper.EntityMetadata> {
    throw new Error("Method not implemented.");
  }
  hasEntityPrivilege(
    entityTypeName: string,
    privilegeType: ComponentFramework.PropertyHelper.Types.PrivilegeType,
    privilegeDepth: ComponentFramework.PropertyHelper.Types.PrivilegeDepth,
  ): boolean {
    throw new Error("Method not implemented.");
  }
  lookupObjects(
    lookupOptions: ComponentFramework.UtilityApi.LookupOptions,
  ): Promise<ComponentFramework.EntityReference[]> {
    throw new Error("Method not implemented.");
  }
}
