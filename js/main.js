//electron check
var nodeRequire = window["nodeRequire"] || window["require"];

this.electron = nodeRequire ? nodeRequire("electron") : null;
if(!this.electron) {
    document.getElementById("loading-image").innerHTML = "Sorry, but WanderComposer only runs on Electron!"
    throw new Error("Non-Electron client")
}

var palette = require('./js/palettes.json')

//load in modules
const renderObj = require('./js/modules/renderObj.js');
const renderGeo = require('./js/modules/renderGeo.js');

const displayUtils = require('./js/utils/displayUtils.js')

const levelOpen = require('./js/utils/levelLoad.js')
const levelSave = require('./js/utils/levelSave.js')

const place = require('./js/modules/placeObj.js')

const fs = require('fs');
const electron = require('electron');

var app;
var viewport;

var level;
var levelhash;

Object.keys(palette).forEach(key=>{
    palette[key].forEach((color, indx)=>{
        palette[key][indx] = parseInt(color, 16)
    })
})
palette.chosentemplate = "color";
palette.color = []; //add in color palette, its generated and handled later

function loadAssets() {
    fs.readdir("./assets/obj", (e, files) => {
        if(e) throw e;
        files.forEach((file, i) => {
            files[i] = 'assets/obj/'+file
        })

        PIXI.Loader.shared
        .add(files)
        .on("progress", loadProgressHandler)
        .load(assetsLoaded);
    })
}

function loadLevel(file, close) {
    let pathArr = file[0].split("/")
    let filename = pathArr[pathArr.length-1]

    displayUtils.displayLoadScreen(true, document)
    displayUtils.loadScreenText("Loading level "+filename+"...", document)

    levelOpen(file, close)
    .then(result => {
        level = result[0];
        levelhash = result[1];

        document.title = result[2] + ' - WanderComposer'

        renderLevel(level);
    })
}

function saveLevel(file) {
    let pathArr = file[0].split("/")
    let filename = pathArr[pathArr.length-1]

    displayUtils.displayLoadScreen(true, document)
    displayUtils.loadScreenText("Saving level "+filename+"...", document)
    levelSave(file, level, levelhash)
    .then(() => {
        displayUtils.displayLoadScreen(false, document)
    })
}

function renderLevel(level) {
    console.log("rendering level...")
    displayUtils.loadScreenText("Rendering level...", document)
    //clear to prevent level "clashing"
    app.renderer.clear()
    while(this.viewport.children.length > 0){ var child = this.viewport.getChildAt(0); this.viewport.removeChild(child);}

    //sort by layers
    level.geo.sort((a, b) => a.layer - b.layer)
    level.geo.reverse()

    level.geo.forEach((geo) => {
        let geoObject = renderGeo(geo, false, palette);

        if(geoObject) { //i have no clue what this little if does but it fixes everything so ill keep it
            geoObject.mouseOverSprite = renderGeo(geo, true, palette);

            geoObject.interactive = true;
            geoObject.mouseOverSprite.visible = false;

            geoObject.on('rightclick', () => {
                displayUtils.displayGeoInfo(geo, document)
                .then(() => {
                    renderLevel(level);
                });
            });

            geoObject.on('mouseover', () => {
                geoObject.alpha = 0; // we use alpha here because !visible doesnt allow events to be called
                geoObject.mouseOverSprite.visible = true;
            })
            geoObject.on('mouseout', () => {
                geoObject.alpha = 1; // we use alpha here because !visible doesnt allow events to be called
                geoObject.mouseOverSprite.visible = false;
            })

            this.viewport.addChild(geoObject, geoObject.mouseOverSprite)
        }
    })

    level.obj.forEach((obj) => {
        let object;
        
        if(renderObj[obj.name] === undefined) {
            object = renderObj["unknown"](obj, false)
            object.mouseOverSprite = renderObj["unknown"](obj, true)
        } else {
            object = renderObj[obj.name](obj, false) //second parameter is for "selected"
            object.mouseOverSprite = renderObj[obj.name](obj, true) 
        }

        object.interactive = true;
        object.mouseOverSprite.visible = false;

        object.on('rightclick', () => {
            displayUtils.displayObjInfo(obj, document)
            .then(() => {
                renderLevel(level);
            })
        });

        object.on('mouseover', () => {
            object.alpha = 0; // we use alpha here because !visible doesnt allow events to be called
            object.mouseOverSprite.visible = true;
        })
        object.on('mouseout', () => {
            object.alpha = 1; // we use alpha here because !visible doesnt allow events to be called
            object.mouseOverSprite.visible = false;
        })

        this.viewport.addChild(object, object.mouseOverSprite);
    })
    displayUtils.displayLoadScreen(false, document);
}

function resize() {
    setTimeout(() => {
        const parent = app.view.parentElement;
        if (!parent)
            return;
        const { clientWidth: width, clientHeight: height } = parent;
        app.renderer.resize(width, height);
        this.viewport.screenWidth = width;
        this.viewport.screenHeight = height;
    }, 15) //im so sorry for this i couldnt fix it any other way
}

function loadProgressHandler(loader, resource) {
    document.getElementById('loading-info').innerText = `Loading... ${resource.url} (${Math.round(loader.progress)}%)`
}

function assetsLoaded() {
    //open up the demo (prologue) level on boot
    //TODO: open last edited level instead
    palette.chosenpalette = 'intro';
    file = ['./js/act00_intro.level'];
    loadLevel(file, true)
}

window.onload = function() {
    //topbar buttons
    document.getElementById('button-file').onclick = () => this.electron.ipcRenderer.send("openLevelFile");
    document.getElementById('button-save').onclick = () => this.electron.ipcRenderer.send("saveLevelFile");
    document.getElementById('button-palette').onclick = () => displayUtils.displayPaletteScreen(document, palette)
        .then((r) => {
            let e = r[0];
            let result = r[1];

            if(e) {
                alert(e);
            } else {
                palette.chosenpalette = result;
                renderLevel(level);
            }
        });
    document.getElementById('button-place-obj').onclick = () => {
        place("objBard", level, 0, 0);
        renderLevel(level);
    }

    document.getElementById('button-place-geo').onclick = () => {
        place("geo", level, 0, 0);
        renderLevel(level);
    }

    window.onclick = function(event) {
        if (event.target == document.getElementById('edit-popup')) {
            editPopup.style.display = "none";
        }
    }

    //Create a Pixi Application
    app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});

    //viewport
    const Viewport = PIXI.extras.Viewport;
    this.viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,
        interaction: this.interaction
    });
    
    app.renderer.backgroundColor = 0x444444;
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";

    app.stage.addChild(this.viewport);
    viewport
        .drag()
        .pinch()
        .wheel({ smooth: 6 });

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.getElementById("mapview").appendChild(app.view);

    document.addEventListener("DOMContentLoaded", resize, false);
    window.onresize = resize;
    resize(); resize(); //oh god

    electron.ipcRenderer.on("openLevelFileCB", (e, file) => {
        loadLevel(file, false);
    });

    electron.ipcRenderer.on("saveLevelFileCB", (e, file) => {
        saveLevel(file);
    });

    loadAssets();

}