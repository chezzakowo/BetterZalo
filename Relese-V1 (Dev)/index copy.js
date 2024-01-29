const { app, BrowserWindow, BrowserView, Menu } = require('electron');
let customMenu = Menu.buildFromTemplate([]);
const path = require('path');

let mainWindow;

let isMenuVisible = true;
let isDevToolsVisible = true;

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
  updateMenu();
  
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
}


function updateMenu() {
  const template = [
    {
      label: 'Toggle Menu',
      click: () => {
        isMenuVisible = !isMenuVisible;
        customMenu = Menu.buildFromTemplate(isMenuVisible ? [] : template);
        Menu.setApplicationMenu(isMenuVisible ? customMenu : null);
      },
    },
    {
      label: 'Toggle Dev Tools',
      click: () => {
        isDevToolsVisible = !isDevToolsVisible;
        mainWindow.webContents.toggleDevTools({ mode: isDevToolsVisible ? 'detach' : 'undocked' });
      },
    },
  ];

  customMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(isMenuVisible ? customMenu : null);
}


app.whenReady().then(createWindow);
