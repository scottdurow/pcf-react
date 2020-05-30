/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventDispatcher } from "ste-events";
import { ParametersChangedEventArgs } from "./ParametersChangedEventArgs";
import { RecordsLoadedEventArgs } from "./RecordsLoadedEventArgs";
import { SaveEventArgs } from "./SaveEventArgs";
import { DatasetChangedEventArgs } from "./DatasetChangedEventArgs";

export class ControlContextService {
  static serviceProviderName = "ControlContextService";
  onRecordsLoaded = new EventDispatcher<ControlContextService, RecordsLoadedEventArgs>();
  onLoadEvent = new EventDispatcher<ControlContextService, void>();
  onParametersChangedEvent = new EventDispatcher<ControlContextService, ParametersChangedEventArgs>();
  onSaveEvent = new EventDispatcher<ControlContextService, SaveEventArgs>();
  onFullScreenModeChangedEvent = new EventDispatcher<ControlContextService, boolean>();
  onIsControlDisabledChangedEvent = new EventDispatcher<ControlContextService, boolean>();
  onDataChangedEvent = new EventDispatcher<ControlContextService, DatasetChangedEventArgs>();
  onInit(_context: ComponentFramework.Context<unknown>): void {
    throw new Error("Method not implemented.");
  }
  onUpdateView(
    _context: ComponentFramework.Context<unknown>,
    _updatedProperties: string[],
  ): { parametersChanged: boolean; layoutChanged: boolean; datasetChanged: boolean } {
    throw new Error("Method not implemented.");
  }
  getPrimaryId(): Xrm.LookupValue {
    throw new Error("Method not implemented.");
  }
  getIsControlReadOnly(): boolean {
    throw new Error("Method not implemented.");
  }
  getIsFullScreen(): boolean {
    throw new Error("Method not implemented.");
  }
  saveFormData(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  closeForm(): void {
    throw new Error("Method not implemented.");
  }
  fullScreen(_fullscreen: boolean): void {
    throw new Error("Method not implemented.");
  }
  lookupRecords(
    _defaultEntityLogicalName: string,
    _entityLogicalNames: string[],
    _allowMultiple: boolean,
  ): Promise<Xrm.LookupValue[]> {
    throw new Error("Method not implemented.");
  }

  // Dataset methods
  refreshDataset(): void {
    throw new Error("Method not implemented.");
  }
  nextPage(): void {
    throw new Error("Method not implemented.");
  }
  previousPage(): void {
    throw new Error("Method not implemented.");
  }
  getDataset(): ComponentFramework.PropertyTypes.DataSet {
    throw new Error("Method not implemented.");
  }
  resetPaging(): void {
    throw new Error("Method not implemented.");
  }
  setPage(pageNumber: number): void {
    throw new Error("Method not implemented.");
  }
  setPageSize(pageSize: number): void {
    throw new Error("Method not implemented.");
  }
  getPaging(): {
    pageNumber: number;
    totalPages?: number;
    totalRecords?: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } {
    throw new Error("Method not implemented.");
  }
  applyFilter(
    _filter?: ComponentFramework.PropertyHelper.DataSetApi.FilterExpression,
    _linking?: ComponentFramework.PropertyHelper.DataSetApi.LinkEntityExposedExpression[],
  ): void {
    throw new Error("Method not implemented.");
  }
  applySort(_sort: ComponentFramework.PropertyHelper.DataSetApi.SortStatus[], _refresh?: boolean): boolean {
    throw new Error("Method not implemented.");
  }
  getSort(): ComponentFramework.PropertyHelper.DataSetApi.SortStatus[] {
    throw new Error("Method not implemented.");
  }
  getColumns(): ComponentFramework.PropertyHelper.DataSetApi.Column[] {
    throw new Error("Method not implemented.");
  }
  setSelectedRecords(_selectedIDs: string[]): void {
    throw new Error("Method not implemented.");
  }
  getCurrentPage(): ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[] {
    throw new Error("Method not implemented.");
  }
  setDatasetColumns(logicalName: string[]): void {
    throw new Error("Method not implemented.");
  }
  // Field Methods
  getParameters<TInputs>(): TInputs {
    throw new Error("Method not implemented.");
  }
  getValues(): Record<string, unknown> {
    throw new Error("Method not implemented.");
  }
  setParameters<TOutputs>(values: TOutputs): void {
    throw new Error("Method not implemented.");
  }
  getOutputs<TOutputs>(): TOutputs {
    throw new Error("Method not implemented.");
  }
  getFormatting(): ComponentFramework.Formatting {
    throw new Error("Method not implemented.");
  }
  getUserSettings(): ComponentFramework.UserSettings {
    throw new Error("Method not implemented.");
  }
  convertToLocalDate(dateProperty: ComponentFramework.PropertyTypes.DateTimeProperty | string | null): Date | null {
    throw new Error("Method not implemented.");
  }
  openRecord(loicalName: string, id: string): void {
    throw new Error("Method not implemented.");
  }
  openNewWindow(url: string): void {
    throw new Error("Method not implemented.");
  }
  showErrorDialog(ex: Error): Promise<void> {
    throw new Error("Method not implemented.");
  }
  showConfirmDialog(
    confirmStrings: ComponentFramework.NavigationApi.ConfirmDialogStrings,
    options?: ComponentFramework.NavigationApi.ConfirmDialogOptions,
  ): Promise<ComponentFramework.NavigationApi.ConfirmDialogResponse> {
    throw new Error("Method not implemented.");
  }
  showProgressDialog(message: string): void {
    throw new Error("Method not implemented.");
  }
  closeProgressDialog(): void {
    throw new Error("Method not implemented.");
  }
}
