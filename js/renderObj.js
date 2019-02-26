module.exports = {
    objSeal: function(obj, select) {
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/seal.png"].texture);
        object.x = obj.x;
        object.y = obj.y;
        
        object.width *= 2
        object.height *= 2

        return object
    },
    objBard: function(obj, select) {
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/bard.png"].texture);
        object.x = obj.x;
        object.y = obj.y-object.height/3*2;
        
        object.width = object.width
        object.height = object.height

        return object
    },
    objHero: function(obj, select) {
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/hero.png"].texture);
        object.x = obj.x;
        object.y = obj.y-object.height;

        return object
    },
    objLightbulb: function(obj, select) {
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/lightbulb.png"].texture)
        
        object.width *= 2
        object.height *= 2

        object.x = obj.x;
        object.y = obj.y-object.height;

        return object
    },
    objEnemy_bat: function(obj, select) {
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/bat.png"].texture)
        
        object.width *= 2
        object.height *= 2

        object.x = obj.x;
        object.y = obj.y-object.height;

        return object
    }
}