import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("mainProcessApi", {
  onFileOpen: (callback: (content: string) => void) => {
    ipcRenderer.on(
      "dialog:fileOpened",
      function openFileListener(_, content: string) {
        callback(content);
      }
    );
  },
  showOpenDialog: () => {
    ipcRenderer.send("dialog:fileOpened");
  },
  showExportHtmlDialog: (html: string) => {
    ipcRenderer.send("dialog:htmlFileExported", html);
  },
});
