var myTileset;
var selectedImage = null;
var selectedTile = null;

function init() { requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
        myTileset = new isoTileSetNameSpace.IsoTileSet();
        setPropertiesList(document.getElementById('tilesetPropertyUL'), myTileset, 'set');
});}

function importImage() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    myTileset.loadImageFromClient(function() {
        let newImage = myTileset._images[myTileset._images.length-1];
        let newImageLI = createImageLI(newImage);
        newImageLI.canvas.onclick = (e) => {            
            selectedImage = newImage;
            if (selectedTile) {
                if (!selectedTile.image) {
                    selectedTile.properties.subImageWidth = newImage.width;
                    selectedTile.properties.subImageHeight = newImage.height;
                    setPropertiesList(document.getElementById('tilePropertiesUL'), selectedTile, 'tile');
                }
                selectedTile.image = newImage;
                drawSelectedTileToCanvas();
                listTiles();
            }            
        }
        newImageLI.button.onclick = (e) => {
            //todo
        }
        document.getElementById('imagesUL').appendChild(newImageLI.li);
    });                    
});}

function newTile() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {

    let newTile = new isoTileNameSpace.IsoTile(null, null);
    myTileset._isoTiles.push(newTile);
    let newTileLI = createImageLI(newTile.image);
    newTileLI.canvas.onclick = (e) => {
        selectedTile = newTile;
        for (let l of e.target.parentNode.parentNode.children) {
            l.style.borderColor = 'black';
        }
        newTileLI.li.style.borderColor = 'red';
        setPropertiesList(document.getElementById('tilePropertiesUL'), newTile, 'tile');
        drawSelectedTileToCanvas();
    }
    newTileLI.button.onclick = (e) => {
        // todo
    }

    document.getElementById('tilesUL').appendChild(newTileLI.li);
});}

function listImages() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    let imagesUL = document.getElementById('imagesUL');
    imagesUL.innerHTML = '';
    for (let i of myTileset._images) {
        let imgli = createImageLI(i);
        imgli.canvas.onclick = (e) => {            
            selectedImage = i;
            if (selectedTile) {
                if (!selectedTile.image) {
                    selectedTile.properties.subImageWidth = i.width;
                    selectedTile.properties.subImageHeight = i.height;
                    setPropertiesList(document.getElementById('tilePropertiesUL'), selectedTile, 'tile');
                }
                selectedTile.image = i;
                drawSelectedTileToCanvas();
                listTiles();
            }            
        }
        imgli.button.onclick = (e) => {
            //todo
        }
        imagesUL.appendChild(imgli.li); 
    }
});}

function listTiles() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    let tilesUL = document.getElementById('tilesUL');
    tilesUL.innerHTML = '';
    for (let t of myTileset._isoTiles) {
        let imgli = createImageLI(t.image);            
        imgli.canvas.onclick = (e) => {
            selectedTile = t;
            setPropertiesList(document.getElementById('tilePropertiesUL'), t, 'tile');
            drawSelectedTileToCanvas();
        }
        imgli.button.onclick = (e) => {
            // todo
        }
        tilesUL.appendChild(imgli.li);
    }
});}

function loadSet() { requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    myTileset.dumbLoad(function() {
        
        console.log(myTileset); 
        selectedTile = null;
        document.getElementById('tilePropertiesUL').innerHTML = '';
        setPropertiesList(document.getElementById('tilesetPropertyUL'), myTileset, 'set');
        listImages();
        listTiles();                      
    });
});}

function saveSet() {
    requirejs([
        'scripts/isotile',
        'scripts/isotileset'
    ], function(isoTileNameSpace, isoTileSetNameSpace) {
        myTileset.dumbSave();
    });
} 

function setPropertiesList(propertiesUL, propertiesOBJ, type) { requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    
    propertiesUL.innerHTML = '';    
    for (key in propertiesOBJ.properties) {
        let pli = document.createElement('li');
        pli.classList.add('w3-theme-l4');
        pli.classList.add('propertyLI');

        let dleft = document.createElement('div');
        dleft.style.textAlign = 'left';
        dleft.style.cssFloat = 'left';
        dleft.innerHTML = key + ':';
        let dright = document.createElement('div');
        dright.style.textAlign = 'right';
        dright.style.cssFloat = 'right';
        
        let inputE = document.createElement('input');
        let prop = propertiesOBJ.properties[key]

        if (typeof propertiesOBJ.properties[key] == 'boolean') {
            inputE.type = 'checkbox';                            
            inputE.checked = propertiesOBJ.properties[key];
        } else {                            
            inputE.style.width = '70px';
            inputE.style.height = '14px';
            inputE.style.textAlign = 'right';
            if (typeof propertiesOBJ.properties[key] == 'number') {
                inputE.type = 'number';
                inputE.step = 'any';
            } else {
                inputE.type = 'text';
            }                        
            inputE.value = propertiesOBJ.properties[key];
        }
        // bad hack
        inputE['data-key'] = key;
        inputE['data-type'] = type;
        inputE.onchange = (e) => {
            if (e.target.type == 'checkbox') {
                if (e.target['data-type'] == 'set') {
                    myTileset.properties[e.target['data-key']] = e.target.checked;
                } else {
                    selectedTile.properties[e.target['data-key']] = e.target.checked;
                }
            } else if (e.target.type == 'number') {
                if (!isNaN(parseFloat(e.target.value))) {
                    if (e.target['data-type'] == 'set') {
                        myTileset.properties[e.target['data-key']] = parseFloat(e.target.value);
                    } else {
                        selectedTile.properties[e.target['data-key']] = parseFloat(e.target.value);
                    }                              
                }
            } else {                
                if (e.target['data-type'] == 'set') {
                    myTileset.properties[e.target['data-key']] = e.target.value;
                } else {
                    selectedTile.properties[e.target['data-key']] = e.target.value;
                }
            }
        }
        dright.appendChild(inputE);        

        pli.appendChild(dleft);
        pli.appendChild(dright);
        propertiesUL.appendChild(pli);
    }
});}

function createImageLI(img) {
    let imageLI = document.createElement('li');
    imageLI.classList.add('selectLI');
    imageLI.classList.add('w3-theme-l2');
    let previewCan = document.createElement('canvas');
    previewCan.width = 50;
    previewCan.height = 50;
    let ctx2 = previewCan.getContext("2d");
    ctx2.fillStyle = "white";
    ctx2.fillRect(0, 0, previewCan.width, previewCan.height);
    if (img) {        
        ctx2.drawImage(img, 0, 0, 50, 50);
    } else {
        ctx2.font = '45px Arial';
        ctx2.fillStyle = 'red';
        ctx2.textAlign = 'center';
        ctx2.fillText('!', 25, 40);
    }
    previewCan.classList.add('previewCanvas');
    imageLI.appendChild(previewCan);
    let removeButton = document.createElement('button');
    removeButton.innerHTML = 'Remove';
    removeButton.classList.add('removeButton');
    imageLI.appendChild(removeButton);
    return {'li': imageLI, 'canvas': previewCan, 'button': removeButton};   
}

function drawSelectedTileToCanvas() {
    if (selectedTile) {
        if (selectedTile.image) {
            let c = document.getElementById('imageCanvas');
            c.width = selectedTile.image.width;
            c.height = selectedTile.image.height;
            let ctx = c.getContext('2d');
            ctx.drawImage(selectedTile.image, 0, 0);
            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.strokeStyle='red';
            ctx.rect(
                selectedTile.properties.subImageX,
                selectedTile.properties.subImageY,
                selectedTile.properties.subImageX + selectedTile.properties.subImageWidth,
                selectedTile.properties.subImageY + selectedTile.properties.subImageHeight,
            );
            ctx.stroke();
        }
    }
}