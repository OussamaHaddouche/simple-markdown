import { ipcRenderer, contextBridge } from "electron";
import { renderMarkdown } from "./renderer/markdown";
import selectors from "./renderer/selectors";

ipcRenderer.on("dialog:fileOpened", async function openFileListener(_, content: string) {
  selectors.markdownView.value = content;
  renderMarkdown(selectors.renderedView, content)
})

contextBridge.exposeInMainWorld("mainProcessApi", {
  showOpenDialog: () => {
    ipcRenderer.send("dialog:fileOpened")
  } 
})

