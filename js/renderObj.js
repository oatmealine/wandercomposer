/* 
important sprites (bard, hero, npcs, etc) are ripped from the game and are hq so we use generic1x() for them
less important sprites are scaled down 2x for compression purposes, so we scale them back up in runtime with generic2x()
*/

const generic1x = (obj, select) => { 
    let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/"+obj.name.replace("obj","").toLowerCase()+".png"].texture)

    object.x = obj.x;
    object.y = obj.y-object.height;

    return object
}

const generic2x = (obj, select) => { 
    let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/"+obj.name.replace("obj","").toLowerCase()+".png"].texture)
    
    object.width *= 2
    object.height *= 2

    object.x = obj.x;
    object.y = obj.y-object.height;

    return object
}

module.exports = {
    //special render functions are needed for non-sprite renders and renders with weird x/y/width/height properties
    objBard: function(obj, select) { //bard has a weird y value so we add the y manually
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/bard.png"].texture);
        object.x = obj.x;
        object.y = obj.y-object.height/3*2;
        
        object.width = object.width
        object.height = object.height

        return object
    },

    //these are all generic - we can use the const functions above to render them
    objHero: generic1x,

    objSeal: generic2x,
    objLightbulb: generic2x,
    objEnemy_bat: generic2x
}