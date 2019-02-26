//the geo render functions are stored here
const saturateFilter = new PIXI.filters.ColorMatrixFilter();
const colorconvert = require('color-convert')

function renderGeoAlone(geo, object) {
    object.moveTo(geo.geo[0].split(",")[0]-geo.x, geo.geo[0].split(",")[1]-geo.y);
    geo.geo.forEach(geoCoords => {
        var coords = geoCoords.split(",");
        object.lineTo(coords[0]-geo.x, coords[1]-geo.y);
    })
    object.lineTo(geo.geo[0].split(",")[0]-geo.x, geo.geo[0].split(",")[1]-geo.y);
}

function renderGeoObject(geo, select, palette) {
    if(geo.visible) {
        let object = new PIXI.Graphics();
        let colors;

        if(palette.chosenpalette === 'color') {
            colors = [];
            for (i = 0; i<=200; i++) {
                colors[i] = parseInt(colorconvert.hsl.hex(i*40%360, 100, 50), 16)
            }
        } else {
            colors = palette[palette.chosenpalette];
        }

        if (colors === undefined) colors = [];

        //colors 100+ are weird and seem to be the same for each palette so we add them in for any palette
        for (i = 100; i<=150; i++) {
            colors[i] = parseInt(colorconvert.hsl.hex((i-100)*20%360, 100, 50), 16)
        }

        object.lineStyle(15, colors[geo.color], 1);
        object.beginFill(colors[geo.color], 0.8+select/10);
        
        object.x = geo.x;
        object.y = geo.y;

        if(select) object.filters = [saturateFilter]

        renderGeoAlone(geo, object);

        return object;
    }
}

module.exports = renderGeoObject