const fs = require('fs');

function levelSave(file, level, levelhash) {
    return new Promise(resolve => {
        if(file) {
            console.log('saving level '+level)

            level.obj.forEach((object, i) => {
                Object.keys(object).forEach(k => {
                    if (!isNaN(object[k])) level.obj[i][k] = parseInt(level.obj[i][k])
                })
            })

            var levelorig = levelhash+'\n'+JSON.stringify(level)

            fs.writeFile(file, levelorig, {encoding: 'utf8'}, (err) => {
                if (err) throw err;
                console.log("saved");
                resolve();
            })
        }
    })

}

module.exports = levelSave;