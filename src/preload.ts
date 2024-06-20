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
  onFilePathChange: (callback: (hasFilePath: boolean) => void) => {
    ipcRenderer.on(
      "file:filePathChange",
      function filePathListener(_, hasFilePath) {
        callback(hasFilePath);
      }
    );
  },
  showOpenDialog: () => {
    ipcRenderer.send("dialog:fileOpened");
  },
  showExportHtmlDialog: (html: string) => {
    ipcRenderer.send("dialog:htmlFileExported", html);
  },
  saveFile: (content: string) => {
   ipcRenderer.send("file:saveFile", content);
  },
  checkForUnsavedChanges: async (content: string) => {
    const result = await ipcRenderer.invoke("file:hasChanges", content)
    return result
  },
  showInFileExplorer: () => {
    ipcRenderer.send("file:showInExplorer")
  },
  openInDefaultApp: () => {
    ipcRenderer.send("file:showInDefaultApp")
  } 
});
