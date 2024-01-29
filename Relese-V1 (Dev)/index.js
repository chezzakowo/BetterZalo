const { app, BrowserWindow, BrowserView, Menu, globalShortcut } = require('electron');
const customMenu = Menu.buildFromTemplate([]);
const path = require('path');

let mainWindow;
let showNavigationBar = true;
let allowDevTools = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  const webview = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
      partition: 'persist:web',
    },
  });
  
  mainWindow.setTitle('Zalo');
  mainWindow.setBrowserView(webview);
  webview.setBounds({ x: 0, y: 0, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height });
  webview.webContents.loadURL('https://chat.zalo.me');
  Menu.setApplicationMenu(customMenu);

  webview.webContents.on('did-finish-load', () => {
    console.log('Trang da load xong!!! - Cre by Chez_ (chezzakowo)');
  });

  webview.webContents.on('dom-ready', () => {
    console.log('DOM da san sang!!!!');
  });

  webview.webContents.on('ipc-message', (event) => {
    if (event.channel === 'web-message') {
      console.log('Dang nhan thong tin tu web:', event.args);
    }
  });

  // Update the webview size when the main window is resized
  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    webview.setBounds({ x: 0, y: 0, width, height });
  });

  // Register shortcut to toggle navigation bar
  globalShortcut.register('CommandOrControl+N', () => {
    showNavigationBar = !showNavigationBar;
    mainWindow.setMenuBarVisibility(showNavigationBar);
  });

  // Register shortcut to toggle dev tools
  globalShortcut.register('CommandOrControl+D', () => {
    if (allowDevTools) {
      mainWindow.webContents.toggleDevTools();
    }
  });

  // Prevent default behavior of dev tools shortcut when dev tools are disallowed
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (!allowDevTools && input.type === 'keyDown' && (input.key === 'F12' || (input.control && input.key === 'KeyJ'))) {
      event.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
});

// Cleanup shortcuts when all windows are closed
app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Cleanup shortcuts on macOS when application is deactivated
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Cleanup shortcuts on macOS when application is deactivated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
