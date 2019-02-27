//display utils such as load screens, popups, etc

function displayLoadScreen(bool, document) {
    let loadingScreen = document.getElementById('loading');

    document.getElementById('loading-info').innerText = "Loading...";
    if(!bool) document.getElementById('loading-info').innerText = "";

    loadingScreen.style.display = 'block';
    if(!bool) loadingScreen.style.display = 'none';
}

function loadScreenText(text, document) {
    document.getElementById('loading-info').innerText = text;
}

function popUp(text, document) {
    let editPopup = document.getElementById('edit-popup');
    let editPopupContent = document.getElementById('edit-popup-content');

    editPopup.style.display = "block";
    editPopupContent.innerHTML = '<a class="btn-floating btn-large waves-effect waves-light red edit-close"><i class="material-icons">clear</i></a>' + text;

    //overwriting the edit-close class removes the onclick function, so we add it back
    document.getElementsByClassName("edit-close")[0].onclick = () => {
        editPopup.style.display = "none";
    }
}

function displayGeoInfo(geo) {
    popUp(`
    <p1>Geometrical Shape | ${geo.id}</p1><br>
    <b>X</b>: ${geo.x}<br>
    <b>Y</b>: ${geo.y}<br>
    <b>Color</b>: ${geo.color}<br>
    <b>Support Points</b> (${geo.geo.length}): <a id="edit-supportpoints" class="waves-effect waves-light btn-small purple">Toggle Visibility</a><br>
    <div id="support-points" style="display:none;">
        - ${geo.geo.join("<br> - ")}
    </div><br>
    `)

    document.getElementById("edit-supportpoints").onclick = function() {
        let supportpoints = document.getElementById("support-points");
        if(supportpoints.style.display === "none") {supportpoints.style.display = "block"} else supportpoints.style.display = "none"
    }
}

function displayObjInfo(obj, document) {
    var popupText = `
    <p1>${obj.name.replace("obj","")} | ${obj.id}</p1><br>
    `

    Object.keys(obj).forEach(key => {
        if (!['id'].includes(key)) {
            popupText += `
            <label for="${key}">${key}</label>
            <input type="text" name="${key}" class="edit-textfield materialize-textarea white-text" placeholder="${obj[key]}" value="${obj[key]}"><br>
            ` //oh boy
        }
    })
    popupText += '<a class="waves-effect waves-light btn-small purple" id="button-update">update</a>'
    popUp(popupText, document)

    document.getElementById("button-update").onclick = () => {
        //oh BOY
        Array.from(document.getElementsByClassName("edit-textfield")).forEach((textfield) => {
            level.obj.find(o => o.id === obj.id)[textfield.name] = textfield.value;
        })
        editPopup.style.display = "none";
    }
}

function displayPaletteScreen(document, palette) {
    return new Promise((resolve) => {
        popUp(`
            <p1>Palette</p1><br>
            <b>Current palette:</b> ${palette.chosenpalette}<br>
            <a id="palette-change" class="waves-effect waves-light btn-small purple inline">change palette</a><input type="text" name="palette" id="palette-textfield" class="inline white-text"><br>
            <b>Palette List:</b><br>
            - ${Object.keys(palette).join("<br> - ")}
        `, document)

        document.getElementById('palette-change').onclick = () => {
            var newPalette = document.getElementById('palette-textfield').value;
            console.log('choosing new palette '+newPalette)
            if(palette[newPalette] === undefined) {
                resolve([new Error(`'${newPalette}' is an invalid palette!`), null])
            } else {
                resolve([undefined, newPalette])
            }
            document.getElementById('edit-popup').style.display = "none";
        }
    })
}

module.exports = {
    displayLoadScreen: displayLoadScreen,
    loadScreenText: loadScreenText,
    displayObjInfo: displayObjInfo,
    displayGeoInfo: displayGeoInfo,
    displayPaletteScreen: displayPaletteScreen
}