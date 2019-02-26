module.exports = {
    objSeal: function(obj, select) {
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/seal.png"].texture);
        object.x = obj.x;
        object.y = obj.y;
        
        object.width = object.width*2
        object.height = object.height*2

        return object
    },
    objBard: function(obj, select) {
        let object = new PIXI.Sprite(PIXI.loader.resources["assets/obj/bard.png"].texture);
        object.x = obj.x;
        object.y = obj.y-object.height/3*2;
        
        object.width = object.width
        object.height = object.height

        return object
    }
}