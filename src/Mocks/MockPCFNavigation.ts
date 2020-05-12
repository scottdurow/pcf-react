/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockPCFNavigation implements ComponentFramework.Navigation {
  openAlertDialog(
    alertStrings: ComponentFramework.NavigationApi.AlertDialogStrings,
    options?: ComponentFramework.NavigationApi.AlertDialogOptions | undefined,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  openConfirmDialog(
    confirmStrings: ComponentFramework.NavigationApi.ConfirmDialogStrings,
    options?: ComponentFramework.NavigationApi.ConfirmDialogOptions | undefined,
  ): Promise<ComponentFramework.NavigationApi.ConfirmDialogResponse> {
    throw new Error("Method not implemented.");
  }
  openErrorDialog(options: ComponentFramework.NavigationApi.ErrorDialogOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }
  openFile(
    file: ComponentFramework.FileObject,
    options?: ComponentFramework.NavigationApi.OpenFileOptions | undefined,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  openForm(
    options: ComponentFramework.NavigationApi.EntityFormOptions,
    parameters?:
      | {
          [key: string]: string;
        }
      | undefined,
  ): Promise<ComponentFramework.NavigationApi.OpenFormSuccessResponse> {
    throw new Error("Method not implemented.");
  }
  openUrl(url: string, options?: ComponentFramework.NavigationApi.OpenUrlOptions | undefined): void {
    throw new Error("Method not implemented.");
  }
  openWebResource(
    name: string,
    options?: ComponentFramework.NavigationApi.OpenWebResourceOptions | undefined,
    data?: string | undefined,
  ): void {
    throw new Error("Method not implemented.");
  }
}
