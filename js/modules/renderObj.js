//all the object render functions are stored here
const selectFilter = new PIXI.filters.OutlineFilter(2, 0x99ff99);

/* 
important sprites (bard, hero, npcs, etc) are ripped from the game and are hq so we use generic1x() for them
less important sprites are scaled down 2x for compression purposes, so we scale them back up in runtime with generic2x()
*/

const generic1x = (obj, select) => { 
    let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/"+obj.name.replace("obj","").toLowerCase()+".png"].texture)

    object.x = obj.x;
    object.y = obj.y-object.height;

    if(select) {
        object.filters = [selectFilter];
    } else {
        object.filters = [];
    };

    return object
}

const generic2x = (obj, select) => { 
    let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/"+obj.name.replace("obj","").toLowerCase()+".png"].texture)
    
    object.width *= 2
    object.height *= 2

    object.x = obj.x;
    object.y = obj.y-object.height;

    if(select) {
        object.filters = [selectFilter];
    } else {
        object.filters = [];
    };

    return object
}

const genericTrigger = (obj, select) => {
    let fillcolor = "#fff";
    if(select) fillcolor = "#eee"

    let bottom = 100;
    let top = 100;
    let right = 100;
    let left = 100;

    if(obj.bottom) bottom = obj.bottom;
    if(obj.top) top = obj.top;
    if(obj.left) left = obj.left;
    if(obj.right) right = obj.right;

    let text = new PIXI.Text(obj.name.replace("obj",""), {
        fill: fillcolor,
        fontSize: 100
    });
    
    let object = new PIXI.Graphics();

    object.lineStyle(15, 0xEEEEEE, 1);
    object.beginFill(0xEEEEEE, 0.5+select/10);

    object.x = obj.x;
    object.y = obj.y;

    text.x = (left-right)/2
    text.y = (bottom-top)/2

    object.drawRect(left, top, right-left, bottom-top);

    object.addChild(text);
    return object;
}

module.exports = {
    //special render functions are needed for non-sprite renders and renders with weird x/y/width/height properties
    objBard: function(obj, select) { //bard has a weird y value so we add the y manually
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/bard.png"].texture);
        
        object.x = obj.x;
        object.y = obj.y-object.height/3*2;
        
        object.width = object.width
        object.height = object.height

        if(select) {
            object.filters = [selectFilter];
        } else {
            object.filters = [];
        };

        return object
    },

    //this is for objects that arent in this render list yet
    unknown: function(obj, select) {
        let fillcolor = "#fff";
        if(select) fillcolor = "#aaa"

        let object = new PIXI.Text(obj.name.replace("obj",""), {
            fill: fillcolor,
            fontSize: 100
        });

        object.x = obj.x;
        object.y = obj.y;

        return object
    },

    //these are all generic - we can use the const functions above to render them
    objHero: generic1x,

    objSeal: generic2x,
    objLightbulb: generic2x,
    objEnemy_bat: generic2x,
    objSWORD: generic2x,

    objCameralook: genericTrigger
}