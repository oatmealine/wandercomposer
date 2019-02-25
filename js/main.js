var nodeRequire = window["nodeRequire"] || window["require"];

var app;
var viewport;

function renderLevel(app, level) {
    level.geo.forEach(geo => {
        if(geo.visible) {
            let geoObject = new PIXI.Graphics();
            geoObject.lineStyle(15, 0x000000, 1);
            
            geoObject.x = geo.x;
            geoObject.y = geo.y;

            geoObject.moveTo(geo.geo[0].split(",")[0], geo.geo[0].split(",")[1]);
            geo.geo.forEach(geoCoords => {
                var coords = geoCoords.split(",");
                geoObject.lineTo(coords[0]-geo.x, coords[1]-geo.y);
            })
            geoObject.lineTo(geo.geo[0].split(",")[0], geo.geo[0].split(",")[1])

            this.viewport.addChild(geoObject)
        }
    })

    level.obj.forEach(obj => {
        let basicText = new PIXI.Text(obj.name, {
            fill: '#000',
            fontSize: 70
        });
        basicText.x = obj.x;
        basicText.y = obj.y;

        this.viewport.addChild(basicText);
    })
}

function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

window.onload = function() {
    this.electron = nodeRequire ? nodeRequire("electron") : null;
    if(!this.electron) {
        document.getElementById("loading-image").innerHTML = "Sorry, but WanderComposer only runs on Electron!"
    } else {
        //Create a Pixi Application
        app = new PIXI.Application({width: 256, height: 256});

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
        
        app.renderer.backgroundColor = 0xffffff;
        app.renderer.view.style.position = "absolute";
        app.renderer.view.style.display = "block";

        app.stage.addChild(this.viewport);
        viewport
            .drag()
            .pinch()
            .wheel({ smooth: 6 });

        window.onresize = resize; resize();

        this.viewport.addChild(graphics);

        let level = require('./level.json');
        renderLevel(app, level);

        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(app.view);

        console.log('ELECTRON_loaded');
    }
}