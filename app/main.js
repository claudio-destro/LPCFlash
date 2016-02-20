'use strict';
const electron = require('electron');
const Menu = electron.Menu;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 1024, height: 768 });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  let menuBar = require('./main_menu');
  let menu = Menu.buildFromTemplate(menuBar);
  Menu.setApplicationMenu(menu);
});

