'use strict';

var electron = require('electron');
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var shell=electron.shell;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow=null;

app.on('ready',function(){
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame:false,
    resizable:false
  });

  // Open the DevTools.
 mainWindow.webContents.openDevTools();

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
      mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});


var ipcMain = electron.ipcMain;
ipcMain.on('close-main-window',function(){
  app.quit();
});

ipcMain.on('minimize-main-window',function(){
  mainWindow.minimize();
});

var settingWindow = null;
var appId;

ipcMain.on('open-setting-window',function(event,id){
   if (settingWindow) {
        return;
    }
      settingWindow = new BrowserWindow({
        frame: false,
        height: 540,
        resizable: false,
        width: 360,
    });
      settingWindow.loadURL('file://' + __dirname + '/app/setting.html');

     //settingWindow.webContents.openDevTools();

      settingWindow.setAlwaysOnTop(true);

      appId=id;

      settingWindow.on('closed', function () {
        settingWindow = null;
    });
});

ipcMain.on('ready-setting-window',function(event){
    event.sender.send('get-app-id',appId);
})

ipcMain.on('close-setting-window', function () {
    if (settingWindow) {
        settingWindow.close();
    }
});

ipcMain.on('app-setting-changed',function(event,btnData){
    mainWindow.webContents.send('change-button-show',btnData);
});


ipcMain.on('open-application',function(event,fullPath){
  shell.openItem(fullPath);
});
console.log(__dirname);
