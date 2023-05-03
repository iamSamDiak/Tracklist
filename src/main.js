const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const { loadFile } = require('./importTrack.js');

function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true
    }
  })

  win.loadFile('src/index.html')

  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('close-window', () => {
    win.close();
  });

  ipcMain.on('get-metadata', async (event, filePath) => {
    loadFile(event, filePath);
  });

  globalShortcut.register('CommandOrControl+R', () => {});

  globalShortcut.register('CommandOrControl+Shift+I', () => {});

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


