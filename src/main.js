const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const { loadFile } = require('./importTrack.js');

function createWindow () {
  // Create the browser window
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

  // Load the index.html file
  win.loadFile('src/index.html')

  // Listen for 'hide-window' message from renderer process
  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  // Listen for 'close-window' message from renderer process
  ipcMain.on('close-window', () => {
    win.close();
  });

  // Listen for 'get-metadata' message from renderer process
  ipcMain.on('get-metadata', async (event, filePath) => {
    loadFile(event, filePath);
  });

}

// When the app is ready, create the window
// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors 
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte 
// de manière explicite par Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//

