const { ipcRenderer } = require('electron');

if (typeof window !== 'undefined') {
  window.electron = {
    restart: () => {
      ipcRenderer.send('restart');
    }
  };
}
