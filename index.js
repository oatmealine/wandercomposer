const { app, protocol, BrowserWindow, ipcMain, dialog, shell } = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "WanderComposer",
    width: 1200,
    height: 800,
    backgroundColor: "#bbbbbb",
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setIcon("./icon.png")

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('resize', (event) => {
    mainWindow.webContents
  })

  ipcMain.on("openLevelFile", (event) => {
    var levelFile = dialog.showOpenDialog({ 
      title: "Open a Wandersong .level file!", 
      properties: ['openFile'], 
      buttonLabel: "Load",
      filters: [
        { name: 'Wandersong Levels', extensions: ['level'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    event.sender.send("openLevelFileCB", levelFile);
  });
  ipcMain.on("saveLevelFile", (event) => {
    var levelFile = dialog.showSaveDialog({ 
      title: "Save the level!", 
      properties: ['saveFile'], 
      buttonLabel: "Save", 
      defaultPath: "mylevel.level",
      filters: [
        { name: 'Wandersong Levels', extensions: ['level'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    event.sender.send("saveLevelFileCB", levelFile);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})