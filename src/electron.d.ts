/// <reference types="vite/client" />
/// <reference types="electron" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

declare interface Window {
  mainProcessApi: {
    onFileOpen: (callback: (content: string) => void) => void;
    onFilePathChange: (callback: (hasFilePath: boolean) => void) => void;
    showOpenDialog: () => void;
    showExportHtmlDialog: (html: string) => void;
    saveFile: (content: string) => void;
    checkForUnsavedChanges: (content: string) => Promise<boolean>;
    showInFileExplorer: () => void;
    openInDefaultApp: () => void;
  };
}
