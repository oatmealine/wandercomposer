var render = require('./js/renderObj.js');
var palette = require('./js/palettes.json')

var nodeRequire = window["nodeRequire"] || window["require"];

var app;
var viewport;
var level;

var chosenpalette = "color"
Object.keys(palette).forEach(key=>{
    palette[key].forEach((color, indx)=>{
        palette[key][indx] = parseInt(color, 16)
    })
})

function displayLoadScreen(bool) {
    if(bool) {
        document.getElementById('loading-info').innerText = "Loading..."
        document.getElementById('loading').style.display = 'block';
        let i = 0;
        function loop () {
            document.getElementById('loading').style.opacity = i/100
            if(!i>=100) {
                i++;
                setTimeout(loop, 1);
            }
        }
        loop();
    } else {
        document.getElementById('loading-info').innerText = ""
        let i = 100;
        function loop () {
            document.getElementById('loading').style.opacity = i/100;
            if(!i<=0) {
                i--;
                setTimeout(loop, 1);
            } else {
                document.getElementById('loading').style.display = 'none';
            }
        }
        loop();
    }
}

function popUp(text) {
    let editPopup = document.getElementById('edit-popup');
    let editPopupContent = document.getElementById('edit-popup-content');

    editPopup.style.display = "block";
    editPopupContent.innerHTML = '<span class="edit-close">x</span>'+text;

    //overwriting the edit-close class removes the onclick function, so we add it back
    document.getElementsByClassName("edit-close")[0].onclick = function() {
        document.getElementById('edit-popup').style.display = "none";
    }
}

function displayGeoInfo(geo) {
    popUp(`
    <p1>Geometrical Shape | ${geo.id}</p1><br>
    <b>X</b>: ${geo.x}<br>
    <b>Y</b>: ${geo.y}<br>
    <b>Color</b>: ${geo.color}<br>
    <b>Support Points</b> (${geo.geo.length}): <a id="edit-supportpoints" class="waves-effect waves-light btn-small">Toggle Visibility</a><br>
    <div id="support-points" style="display:none;">
        - ${geo.geo.join("<br> - ")}
    </div><br>
    `)

    document.getElementById("edit-supportpoints").onclick = function() {
        let supportpoints = document.getElementById("support-points");
        if(supportpoints.style.display === "none") {supportpoints.style.display = "block"} else supportpoints.style.display = "none"
    }
}


function renderGeo(geo, geoObject) {
    geoObject.moveTo(geo.geo[0].split(",")[0]-geo.x, geo.geo[0].split(",")[1]-geo.y);
    geo.geo.forEach(geoCoords => {
        var coords = geoCoords.split(",");
        geoObject.lineTo(coords[0]-geo.x, coords[1]-geo.y);
    })
    geoObject.lineTo(geo.geo[0].split(",")[0]-geo.x, geo.geo[0].split(",")[1]-geo.y);
}

function renderLevel(level) {
    displayLoadScreen(true);
    var colorconvert = require('color-convert')

    document.getElementById('loading-info').innerText = "Loading level..."
    //clear to prevent level "clashing"
    app.renderer.clear()
    while(this.viewport.children.length > 0){ var child = this.viewport.getChildAt(0); this.viewport.removeChild(child);}

    //sort by layers
    level.geo.sort((a, b) => a.layer - b.layer)
    level.geo.reverse()

    level.geo.forEach(geo => {
        if(geo.visible) {
            let geoObject = new PIXI.Graphics();
            let colors;

            if(chosenpalette === 'color') {
                colors = [];
                for (i = 0; i<=200; i++) {
                    colors[i] = parseInt(colorconvert.hsl.hex(i*40%360, 100, 50), 16)
                }
            } else {
                colors = palette[chosenpalette];
            }

            //colors 100+ are weird and seem to be the same for each palette so we add them in for any palette
            for (i = 100; i<=150; i++) {
                colors[i] = parseInt(colorconvert.hsl.hex((i-100)*20%360, 100, 50), 16)
            }

            let fillColors = [];
            colors.forEach(c => {
                let hslcolor = colorconvert.hex.hsl(c.toString(16))
                hslcolor[2] += 10;
                fillColors.push(parseInt(colorconvert.hsl.hex(hslcolor), 16));
            })


            geoObject.lineStyle(15, colors[geo.color], 1);
            geoObject.beginFill(colors[geo.color], 0.8);
            
            geoObject.x = geo.x;
            geoObject.y = geo.y;

            geoObject.interactive = true;

            renderGeo(geo, geoObject)

            //mouse-over ver with different colors
            
            geoObject.mouseOverSprite = new PIXI.Graphics();
            geoObject.mouseOverSprite.visible = false;
            geoObject.mouseOverSprite.lineStyle(15, fillColors[geo.color], 1);
            geoObject.mouseOverSprite.beginFill(colors[geo.color], 0.9);
            renderGeo(geo, geoObject.mouseOverSprite)

            geoObject.mouseOverSprite.x = geo.x;
            geoObject.mouseOverSprite.y = geo.y;

            geoObject.on('rightclick', () => {
                displayGeoInfo(geo)
            });
            
            geoObject.on('mouseover', () => {
                geoObject.alpha = 0; // we use alpha here because !visible doesnt allow events to be called
                geoObject.mouseOverSprite.visible = true;
            })
            geoObject.on('mouseout', () => {
                geoObject.alpha = 1; // we use alpha here because !visible doesnt allow events to be called
                geoObject.mouseOverSprite.visible = false;
            })

            this.viewport.addChild(geoObject)
            this.viewport.addChild(geoObject.mouseOverSprite)
        }
    })

    level.obj.forEach(obj => {
        let object;
        if(render[obj.name] === undefined) {
            object = new PIXI.Text(obj.name.replace("obj",""), {
                fill: '#fff',
                fontSize: 100
            });

            object.x = obj.x;
            object.y = obj.y;
        } else {
            console.log(obj.name+" has custom render function")
            object = render[obj.name](obj, false) //second parameter is for "selected"
        }

        object.interactive = true;
        this.viewport.addChild(object);
    })
    displayLoadScreen(false);
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
    electron.ipcRenderer.send("openLevelFile");
}

window.onload = function() {
    this.electron = nodeRequire ? nodeRequire("electron") : null;
    if(!this.electron) {
        document.getElementById("loading-image").innerHTML = "Sorry, but WanderComposer only runs on Electron!"
    } else {
        const electron = require('electron');
        const fs = require('fs');

        //topbar buttons
        document.getElementById('button-file').onclick = () => {
            this.electron.ipcRenderer.send("openLevelFile");
        }
        document.getElementById('button-palette').onclick = () => {
            popUp(`
            <p1>Palette</p1><br>
            <b>Current palette:</b> ${chosenpalette}<br>
            <input type="text" name="palette" id="palette-textfield"> <a id="palette-change" class="waves-effect waves-light btn-small">change palette</a><br>
            <b>Palette List:</b><br>
            - color (default)<br>
            - ${Object.keys(palette).join("<br> - ")}
            `)

            document.getElementById('palette-change').onclick = () => {
                var newPalette = document.getElementById('palette-textfield').value;
                if(palette[newPalette] === undefined) {
                    alert(`'${newPalette}' is an invalid palette!`)
                } else {
                    chosenpalette = newPalette
                    renderLevel(level);
                }
            }
        }

        let editPopup = document.getElementById('edit-popup');

        window.onclick = function(event) {
            if (event.target == editPopup) {
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
            if(file) {
                console.log('opening level file '+file)
                fs.readFile(file[0], {encoding: 'utf8'}, (err, data) => {
                    if (err) throw err;
                    level = JSON.parse(data.split("\n")[1]);
                    renderLevel(level);
                })
            } else {
                if(!level) {
                    window.close();
                }
            }
        });

        PIXI.loader
            .add("assets/obj/seal.png")
            .add("assets/obj/bard.png")
            .on("progress", loadProgressHandler)
            .load(assetsLoaded);
    }
}