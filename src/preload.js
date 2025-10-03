// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// 预加载脚本：src/preload/index.js
import { contextBridge, ipcRenderer } from "electron";



// 通过contextBridge暴露安全的API
contextBridge.exposeInMainWorld("windowControls", {
  // 最小化窗口
  minimize: () => ipcRenderer.send("window-min"),
  // 最大化/还原窗口
  toggleMaximize: () => ipcRenderer.send("window-max-toggle"),
  // 关闭窗口
  close: () => ipcRenderer.send("window-close"),

  // 可选：接收主进程发送的窗口状态变化（如最大化状态改变）
  onWindowStateChange: (callback) => {
    ipcRenderer.on("window-state-changed", (event, isMaximized) => {
      callback(isMaximized);
    });
  },
});


contextBridge.exposeInMainWorld('electronAPI', {
  // 调用打开对话框的方法（通过 IPC 通知主进程）
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  // 可以添加其他需要的对话框方法（如保存对话框）
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options)
});