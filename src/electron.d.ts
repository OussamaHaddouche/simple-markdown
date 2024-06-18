/// <reference types="vite/client" />
/// <reference types="electron" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

declare interface Window {
  mainProcessApi: {
    onFileOpen: (callback: (content: string) => void) => void;
    showOpenDialog: () => void;
    showExportHtmlDialog: (html: string) => void;
  };
}
