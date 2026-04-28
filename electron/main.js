const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    frame: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.maximize();
  win.once('ready-to-show', () => {
    win.show();
  });

  // win.loadURL('http://localhost:4200');
  win.loadURL('https://tfglam.vercel.app/');
}

app.whenReady().then(createWindow);

