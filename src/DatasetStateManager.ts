/* eslint-disable @typescript-eslint/no-unused-vars */
export class DatasetStateManager {
  public currentPage = 1;
  private dataset?: ComponentFramework.PropertyTypes.DataSet;
  private pageSize = 0;
  private pendingData = false;

  reset(): void {
    this.currentPage = 1;
    this.dataset?.paging.reset();
  }
  refresh(): void {
    this.currentPage = 1;
    this.dataset?.refresh();
    this.pendingData = true;
  }
  getTotalRecords(): number | undefined {
    return this.dataset?.paging.totalResultCount;
  }
  getPageNumber(): number {
    return this.currentPage;
  }
  getPageSize(): number {
    return this.pageSize;
  }
  getTotalPages(): number {
    const totalRecords = this.getTotalRecords();
    return totalRecords ? Math.ceil(totalRecords / this.pageSize) : 1;
  }
  hasNextPage(): boolean {
    if (this.dataset) {
      return this.dataset.paging.hasNextPage;
    } else {
      return false;
    }
  }
  hasPreviousPage(): boolean {
    if (this.dataset) {
      return this.dataset.paging.hasPreviousPage;
    } else {
      return false;
    }
  }
  setPage(pageNumber: number): void {
    if (this.pendingData) return;
    if (pageNumber > 0 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
      if (this.dataset) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.loadPage(pageNumber);
      }
    }
  }
  nextPage(): boolean {
    if (this.pendingData) return false;
    if (this.hasNextPage()) {
      this.currentPage++;
      this.loadPage(this.currentPage);
    }
    return true;
  }
  nextPageIncremental(): boolean {
    if (this.pendingData) return false;
    if (this.hasNextPage()) {
      this.currentPage++;
      this.dataset?.paging.loadNextPage();
    }
    return true;
  }
  loadPage(index: number): boolean {
    if (this.pendingData) return false;
    this.pendingData = true;
    this.currentPage = index;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pagingAny = this.dataset?.paging as any;
    pagingAny.loadExactPage(index);
    return true;
  }
  previousPage(): boolean {
    if (this.pendingData) return false;
    if (this.hasPreviousPage()) {
      this.currentPage--;
      this.loadPage(this.currentPage);
    }
    return true;
  }
  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.dataset?.paging.setPageSize(pageSize);
    this.loadPage(1);
  }
  appySort(sort: ComponentFramework.PropertyHelper.DataSetApi.SortStatus[], refresh?: boolean): boolean {
    if (this.pendingData) {
      console.log("PCF: Sort pending data");
      return false;
    }
    if (!this.dataset) throw new Error("dataset is not loaded");
    while (this.dataset.sorting.length > 0) {
      this.dataset.sorting.pop();
    }
    this.dataset.sorting.push(...sort);
    if (refresh) {
      this.refresh();
    }
    return true;
  }
  setData(dataset: ComponentFramework.PropertyTypes.DataSet): { dataHasChanged: boolean } {
    this.pendingData = false;
    this.dataset = dataset;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.pageSize = (dataset.paging as any).pageSize;
    if (this.currentPage > 1 && !dataset.paging.hasPreviousPage) {
      this.currentPage = 1;
    } else if (this.currentPage == 1 && dataset.paging.hasPreviousPage) {
      // We are starting in the middle of the pages (can happen on mobile and Canvas)
      // Move to the first page
      this.setPage(1);
    }
    const dataHasChanged = {
      dataHasChanged: false,
    };

    return dataHasChanged;
  }
}
