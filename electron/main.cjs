const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0A0A0A',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'GitSwitch Desktop',
    frame: true
  });

  // In production, load the built index.html
  // In development, we load the Vite dev server URL
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  win.loadURL(startUrl);
}

// Native command to clear Windows Credentials
ipcMain.handle('clear-git-credentials', async () => {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    
    // Commands to purge git credentials
    const command = isWin 
      ? 'cmdkey /list | findstr "git github gitlab" && for /f "tokens=1,2 delims= " %a in (\'cmdkey /list ^| findstr "git github gitlab"\') do cmdkey /delete:%b'
      : 'security delete-internet-password -s "github.com"'; // Simplified for Mac demo

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        resolve({ success: false, message: error.message });
        return;
      }
      resolve({ success: true, output: stdout });
    });
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
