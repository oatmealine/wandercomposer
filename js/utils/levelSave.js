const fs = require('fs');

function levelSave(file, level, levelhash) {
    return new Promise(resolve => {
        if(file) {
            console.log('saving level '+level)

            let newlevel = {geo: [], obj: []};

            level.geo.forEach((object, i) => {
                if(object) {
                    let newobject = {};
                    Object.keys(object).forEach(k => {
                        if (!isNaN(object[k])) {
                            newobject[k] = parseInt(level.geo[i][k])
                        } else newobject[k] = level.geo[i][k]
                    })
                    newlevel.geo.push(newobject)
                }
            })

            level.obj.forEach((object, i) => {
                if(object) {
                    let newobject = {};
                    Object.keys(object).forEach(k => {
                        if (!isNaN(object[k])) {
                            newobject[k] = parseInt(level.obj[i][k])
                        } else newobject[k] = level.obj[i][k]
                    })
                    newlevel.obj.push(newobject)
                }
            })

            var levelorig = levelhash+'\n'+JSON.stringify(newlevel)

            fs.writeFile(file, levelorig, {encoding: 'utf8'}, (err) => {
                if (err) throw err;
                console.log("saved");
                resolve(newlevel);
            })
        }
    })

}

module.exports = levelSave;