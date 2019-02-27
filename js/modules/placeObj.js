function placeObj(objname="objBard", level, x=0, y=0) {
    let id = 0;
    level.obj.forEach(obj => {if(obj.id > id) id = obj.id});
    level.geo.forEach(geo => {if(geo.id > id) id = geo.id}); //find the highest id atm and use an id one higher than that
    id++;

    level.obj.push({
        name: objname,
        id: id,
        x: x,
        y: y
    })
}

function placeGeo(level, x=0, y=0) {
    let id = 0;
    level.obj.forEach(obj => {if(obj.id > id) id = obj.id});
    level.geo.forEach(geo => {if(geo.id > id) id = geo.id}); //find the highest id atm and use an id one higher than that
    id++;

    level.geo.push({
        id: id,
        x: x,
        y: y,
        geo: ["0,0","0,500", "500,500", "500,0"],
        color: Math.floor(Math.random()*10),
        altcol: -1,
        bottom: 0,
        draw: [0, 1, 2],
        group: "",
        jtrender: 0,
        jumpthrough: 0,
        layer: 0,
        left: 0,
        object: -1,
        right: 0,
        solid: 1,
        surface: -1,
        texture: "",
        top: 0,
        visible: 1,
        windy: 0
    })
}

function place(objname, level, x, y) {
    if(objname.startsWith("obj")) {
        placeObj(objname, level, x, y);
        return;
    } else if(objname === "geo") {
        placeGeo(level, x, y);
        return;
    }
}

module.exports = place