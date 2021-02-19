// PCF notifies us even when values have not changed.
export type ConvertToLocalDateDelegate = (
  dateProperty: ComponentFramework.PropertyTypes.DateTimeProperty,
) => Date | null;
// ParameterState keeps tabs on which values have actually changed
// Canvas App PCF controls don't get notified of which parameters have chaned
// Model Driven Apps get passed all parameters on save even if they haven't changed
export class PCFPropertyBagStateManager {
  private emmitDebug = false;
  constructor(convertToLocalDate: ConvertToLocalDateDelegate, emmitDebug?: boolean) {
    this.convertToLocalDate = convertToLocalDate;
    this.emmitDebug = emmitDebug ?? false;
  }
  private convertToLocalDate: ConvertToLocalDateDelegate;
  private updatedValues: Record<string, unknown> = {};
  public currentValues: Record<string, unknown> = {};
  debug(message: string): void {
    if (this.emmitDebug) {
      console.debug(message);
    }
  }
  public setAllProperties(properties: Record<string, unknown>): void {
    // Set the values
    this.currentValues = {};
    this.getInboundChangedProperties(properties, Object.keys(properties));
  }

  public updateProperties(parameters: unknown): void {
    // Merge the changed values with the existing pending changes
    const paramRecord = parameters as Record<string, unknown>;

    // Work out which parameters have changed
    for (const property in paramRecord) {
      let newValue: unknown = paramRecord[property];
      let oldValue: unknown = this.currentValues[property];
      if (newValue instanceof Date) {
        newValue = (newValue as Date)?.toISOString();
        oldValue = (oldValue as Date)?.toISOString();
      }
      if (newValue != oldValue) {
        this.debug(`PCF:OUT ${property}=${newValue} (new)\nPCF:OUT ${property}=${oldValue} (old)`);
        this.updatedValues[property] = paramRecord[property];
        this.currentValues[property] = paramRecord[property];
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getInboundChangedProperties(properties: Record<string, unknown>, updatedProperties: string[]): string[] {
    const changedProperties: string[] = [];
    for (const propertyName of updatedProperties) {
      const property = properties[propertyName] as ComponentFramework.PropertyTypes.Property;

      if (property && property.type != undefined) {
        let skip = false;
        let newValueRaw: unknown = property.raw;
        let newValueCompare: unknown = property.raw;
        let oldValueCompare: unknown = this.currentValues[propertyName];
        // Some raw types can't be compared as objects
        switch (property.type) {
          case "DataSet":
            // Canvas provides a DataSet property of any bound column
            // since the values are actually in the records, we don't need this
            skip = true;
            break;
          case "":
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((property as any).records) {
              // this is a dataset property
              skip = true;
            }
            // Guid/entity id's type == ""
            // The raw value is a Guid object
            newValueCompare = property.raw && property.raw.toString();
            oldValueCompare = (this.currentValues[propertyName] as object)?.toString();
            break;
          case "DateAndTime.DateAndTime":
          case "DateAndTime.DateOnly":
            // Adjust for the fact that we get the date values in utc - convert to local time
            newValueRaw = this.convertToLocalDate(property as ComponentFramework.PropertyTypes.DateTimeProperty);
            newValueCompare = (newValueRaw as Date | null)?.toISOString();
            oldValueCompare = (this.currentValues[propertyName] as Date)?.toISOString();
            break;
        }
        if (!skip && newValueCompare != oldValueCompare) {
          this.debug(
            `PCF:IN ${propertyName}=${newValueCompare} (new)\nPCF:IN ${propertyName}=${oldValueCompare} (old)`,
          );
          changedProperties.push(propertyName);
          this.currentValues[propertyName] = newValueRaw;
        }
      }
    }
    return changedProperties;
  }
  getOutboundChangedProperties<T>(): T {
    const pendingChanges = this.updatedValues;
    this.updatedValues = {};
    return pendingChanges as T;
  }
}
