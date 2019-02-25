const {app, BrowserWindow} = require('electron')

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

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.setIcon("./icon.png")

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

  mainWindow.webContents.on('console-message', (event, level, message) => {
    if(message.startsWith('ELECTRON_')) {
        let cmd = message.replace('ELECTRON_','').split(" ")[0]
        let web = mainWindow.webContents

        switch(cmd) {
            case 'loaded':
              let i = 100;

              function loop () {
                i--;
                web.executeJavaScript('document.getElementById(\'loading\').style.opacity = '+i+'/100');
                if(!i<=0) {
                  setTimeout(loop, 3);
                } else {
                  web.executeJavaScript('document.getElementById(\'loading\').style.display = \'none\'');
                }
              }

              loop();
              break;
        }
    }
  })
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