import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { parseFile } from "music-metadata";
import * as fs from 'fs/promises';
const ipc = ipcMain;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, "/assets/logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "/preload.js"),
      contextIsolation: true,
      webSecurity: false,
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
  mainWindow.setHasShadow(true);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ipcMain.on("window-min", () => {
    mainWindow.minimize();
  });

  ipcMain.on("window-max-toggle", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
      // 可选：通知渲染进程窗口状态变化
      mainWindow.webContents.send("window-state-changed", false);
    } else {
      mainWindow.maximize();
      // 可选：通知渲染进程窗口状态变化
      mainWindow.webContents.send("window-state-changed", true);
    }
  });

  ipcMain.on("window-close", () => {
    mainWindow.close();
  });

  ipcMain.on("toggle-fullscreen", (event, arg) => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    return mainWindow.isFullScreen();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// 监听渲染进程的对话框请求（主进程处理）
ipcMain.handle("show-open-dialog", async (event, options) => {
  // 调用对话框并返回结果
  try {
    const result = (await dialog.showOpenDialog(options));
    return result;
  } catch (error) {
    return null;
  }
});

ipcMain.handle("parseFileMetadata", async (event, options) => {
  const metadata = await await parseFile(options);
  return metadata;
});

ipcMain.handle("toggle-fullscreen", async (event) => {
  mainWindow.setFullScreen(true);
  return mainWindow;
});

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return { success: true, data };
  } catch (error) {
    console.error("读取文件失败", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    await writeFile(filePath, content, 'utf8');
    return { success: true, message: '文件写入成功' };
  } catch (error) {
    console.error('写入文件失败:', error);
    return { success: false, error: error.message };
  }
});