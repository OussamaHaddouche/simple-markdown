import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import { readFile, writeFile } from "fs/promises";
import path from "path";

type MarkDownFile = {
  content?: string;
  filePath?: string;
};

let currentFile: MarkDownFile = {
  content: "",
};

async function getCurrentFile(browserWindow: BrowserWindow) {
  if (currentFile.filePath) return currentFile.filePath;
  if (!browserWindow) return;
  return await showSaveDialog(browserWindow);
}

function setCurrentFile(
  browserWindow: BrowserWindow,
  filePath: string,
  content: string
) {
  currentFile.filePath = filePath;
  currentFile.content = content;
  browserWindow.setTitle(`${path.basename(filePath)} - ${app.name}`);
  browserWindow.setRepresentedFilename(filePath);
  app.addRecentDocument(filePath);
  browserWindow.webContents.send("file:filePathChange", true);
}

function hasChanges(content: string) {
  return (
    currentFile.content?.replace(/[\n\r\t\b\f\v]/g, "") !==
    content.replace(/[\n\r\t\b\f\v]/g, "")
  );
}

ipcMain.handle(
  "file:hasChanges",
  async function handleFileHasChanges(event, content) {
    const changed = hasChanges(content);
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    browserWindow?.setDocumentEdited(changed);
    return changed;
  }
);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("dialog:fileOpened", (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  if (!browserWindow) return;
  showOpenDialog(browserWindow);
});

ipcMain.on("dialog:htmlFileExported", (event, html: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  if (!browserWindow) return;
  showExportHtmlDialog(browserWindow, html);
});

ipcMain.on("file:saveFile", (event, html: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  if (!browserWindow) return;
  saveFile(browserWindow, html);
});

ipcMain.on("file:showInExplorer", async () => {
  if (currentFile.filePath) {
    await shell.showItemInFolder(currentFile.filePath);
  }
});

ipcMain.on("file:showInDefaultApp", async () => {
  if (currentFile.filePath) {
    await shell.openPath(currentFile.filePath);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function showOpenDialog(browserWindow: BrowserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    properties: ["openFile"],
    filters: [{ name: "Markdown File", extensions: ["md"] }],
  });
  if (result.canceled) return;
  const [filePath] = result.filePaths;
  openFile(browserWindow, filePath);
}

async function openFile(browserWindow: BrowserWindow, filePath: string) {
  const content = await readFile(filePath, { encoding: "utf8" });
  setCurrentFile(browserWindow, filePath, content);
  browserWindow.webContents.send("dialog:fileOpened", content);
}

async function showExportHtmlDialog(
  browserWindow: BrowserWindow,
  html: string
) {
  const result = await dialog.showSaveDialog(browserWindow, {
    title: "Export as HTML",
    filters: [{ name: "HTML file", extensions: ["html"] }],
  });

  if (result.canceled) return;

  const { filePath } = result;

  if (!filePath) return;

  exportHTML(filePath, html);
}

async function exportHTML(filePath: string, html: string) {
  await writeFile(filePath, html, { encoding: "utf8" });
}

async function showSaveDialog(browserWindow: BrowserWindow) {
  const result = await dialog.showSaveDialog(browserWindow, {
    title: "Save markdown",
    filters: [{ name: "Markdown File", extensions: ["md"] }],
  });

  if (result.canceled) return;

  const { filePath } = result;

  if (!filePath) return;

  return filePath;
}

async function saveFile(browserWindow: BrowserWindow, content: string) {
  const filePath = await getCurrentFile(browserWindow);

  if (!filePath) return;

  await writeFile(filePath, content, { encoding: "utf8" });
  setCurrentFile(browserWindow, filePath, content);
}

const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: "File",
    submenu: [{
      label: "Open",
      click: () => {
        let browserWindow = BrowserWindow.getFocusedWindow();
        if(!browserWindow) browserWindow = createWindow();
        showOpenDialog(browserWindow);
      },
      accelerator: "CmdOrCtrl+O"
    }]
  },
  { label: "Edit", role: "editMenu" },
];

if (process.platform === "darwin") {
  menuTemplate.unshift({
    label: app.name,
  });
}

const menu = Menu.buildFromTemplate(menuTemplate);

Menu.setApplicationMenu(menu)

