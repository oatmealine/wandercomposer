const fs = require('fs');

function levelLoad(file, closeOnInvalid) {
    return new Promise(resolve => {
        if(file) {
            console.log('opening level file '+file);
            fs.readFile(file[0], {encoding: 'utf8'}, (err, data) => {
                if (err) throw err;
                let levelhash = data.split("\n")[0];
                let level = JSON.parse(data.split("\n")[1]);
    
                let pathArr = file[0].split("/")
                let filename = pathArr[pathArr.length-1]
    
                console.log('done')
                resolve([level, levelhash, filename])
            })
        } else {
            if(closeOnInvalid) {
                window.close();
            }
        }
    })

}

module.exports = levelLoad;