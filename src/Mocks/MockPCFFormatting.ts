/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockPCFFormatting implements ComponentFramework.Formatting {
  formatCurrency(value: number, precision?: number | undefined, symbol?: string | undefined): string {
    throw new Error("Method not implemented.");
  }
  formatDecimal(value: number, precision?: number | undefined): string {
    throw new Error("Method not implemented.");
  }
  formatDateAsFilterStringInUTC(value: Date, includeTime?: boolean | undefined): string {
    throw new Error("Method not implemented.");
  }
  formatDateLong(value: Date): string {
    throw new Error("Method not implemented.");
  }
  formatDateLongAbbreviated(value: Date): string {
    throw new Error("Method not implemented.");
  }
  formatDateShort(value: Date, includeTime?: boolean | undefined): string {
    throw new Error("Method not implemented.");
  }
  formatDateYearMonth(value: Date): string {
    throw new Error("Method not implemented.");
  }
  formatInteger(value: number): string {
    throw new Error("Method not implemented.");
  }
  formatLanguage(value: number): string {
    throw new Error("Method not implemented.");
  }
  formatTime(value: Date, behavior: ComponentFramework.FormattingApi.Types.DateTimeFieldBehavior): string {
    throw new Error("Method not implemented.");
  }
  getWeekOfYear(value: Date): number {
    throw new Error("Method not implemented.");
  }
}
