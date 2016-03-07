'use strict';
const electron = require('electron');
const Menu = electron.Menu;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let menuBar;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  menuBar = require('./main_menu');
  let menu = Menu.buildFromTemplate(menuBar);
  Menu.setApplicationMenu(menu);
  openProgrammer();
});

app.on('new-window', openProgrammer);

function openProgrammer() {
  if (!mainWindow) {
    Menu.items()[1].submenu[0].enabled = true;
    mainWindow = new BrowserWindow({ width: 1024, height: 768 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function () {
      Menu.items()[1].submenu[0].enabled = true;
      mainWindow = null;
    });
  }
}