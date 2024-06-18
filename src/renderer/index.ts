/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import { renderMarkdown } from "./markdown";
import selectors from "./selectors";

function renderHTMl(content: string) {
  selectors.markdownView.value = content;
  renderMarkdown(selectors.renderedView, content);
}

window.mainProcessApi.onFileOpen(renderHTMl);

selectors.openFileButton.addEventListener("click", function openFileListener() {
  window.mainProcessApi.showOpenDialog();
});

selectors.exportHtmlButton.addEventListener(
  "click",
  function openFileListener() {
    window.mainProcessApi.showExportHtmlDialog(selectors.renderedView.innerHTML);
  }
);

selectors.markdownView.addEventListener('input', async () => {
  const markdown = selectors.markdownView.value;
  renderMarkdown(selectors.renderedView, markdown);
});
