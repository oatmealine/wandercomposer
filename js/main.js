var nodeRequire = window["nodeRequire"] || window["require"];

var app;
var viewport;

//var coloroffset = Math.floor(Math.random()*360);
var coloroffset = 0;

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function renderLevel(app, level) {
    //sort by layers
    level.geo.sort((a, b) => a.layer - b.layer)
    level.geo.reverse()

    level.geo.forEach(geo => {
        if(geo.visible) {
            let geoObject = new PIXI.Graphics();
            geoObject.lineStyle(15, parseInt(hslToHex((geo.color+coloroffset)*45%360, 100, 50).replace('#',''), 16), 1);
            geoObject.beginFill(parseInt(hslToHex((geo.color+coloroffset)*45%360, 80, 50).replace('#',''), 16), 0.9);
            
            geoObject.x = geo.x;
            geoObject.y = geo.y;

            geoObject.moveTo(geo.geo[0].split(",")[0]-geo.x, geo.geo[0].split(",")[1]-geo.y);
            geo.geo.forEach(geoCoords => {
                var coords = geoCoords.split(",");
                geoObject.lineTo(coords[0]-geo.x, coords[1]-geo.y);
            })
            geoObject.lineTo(geo.geo[0].split(",")[0]-geo.x, geo.geo[0].split(",")[1]-geo.y);

            this.viewport.addChild(geoObject)
        }
    })

    level.obj.forEach(obj => {
        let basicText = new PIXI.Text(obj.name.replace("obj",""), {
            fill: '#fff',
            fontSize: 100
        });
        basicText.x = obj.x;
        basicText.y = obj.y;

        this.viewport.addChild(basicText);
    })
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

window.onload = function() {
    this.electron = nodeRequire ? nodeRequire("electron") : null;
    if(!this.electron) {
        document.getElementById("loading-image").innerHTML = "Sorry, but WanderComposer only runs on Electron!"
    } else {
        //Create a Pixi Application
        app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});

        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.lineStyle(5, 0x000000);

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

        this.viewport.addChild(graphics);

        let level = require('./level.json');
        renderLevel(app, level);

        //Add the canvas that Pixi automatically created for you to the HTML document
        document.getElementById("mapview").appendChild(app.view);

        document.addEventListener("DOMContentLoaded", resize, false);
        window.onresize = resize;
        resize(); resize(); //oh god

        console.log('ELECTRON_loaded');
    }
}