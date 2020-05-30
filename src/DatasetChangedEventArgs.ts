export interface DatasetChangedEventArgs {
  page: number;
  totalRecords?: number;
  totalPages?: number;
  pageSize: number;
  data: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord[];
}
