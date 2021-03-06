var myTileset;
var selectedImage = null;
var selectedTile = null;
var isAnimating = false;
var cursor = {
    useCursor: false,
    width: 128,
    height: 128,
    x: 0,
    y: 0
}

function init() { requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
        myTileset = new isoTileSetNameSpace.IsoTileSet();
        setPropertiesList(document.getElementById('tilesetPropertyUL'), myTileset, 'set');
        document.getElementById('useCursorCheckBox').addEventListener('click', ()=> {
            cursor.useCursor = !cursor.useCursor;
            if (cursor.useCursor) {
                document.getElementById('cursorWidthInput').removeAttribute('disabled');
                document.getElementById('cursorHeightInput').removeAttribute('disabled');
            } else {
                document.getElementById('cursorWidthInput').setAttribute('disabled', 'disabled');
                document.getElementById('cursorHeightInput').setAttribute('disabled', 'disabled');
            }
        });
        document.getElementById('cursorWidthInput').addEventListener('change', (e)=> {
            cursor.width = e.target.value;
        });
        
        document.getElementById('cursorHeightInput').addEventListener('change', (e)=> {
            cursor.height = e.target.value;
        });
        document.getElementById('useCursorCheckBox').checked = false;
        document.getElementById('cursorWidthInput').value = cursor.width;        
        document.getElementById('cursorHeightInput').value = cursor.height;
        document.getElementById('imageCanvas').addEventListener('mousemove', (e) => {
            if (cursor.useCursor) {
                var canvasRect = e.target.getBoundingClientRect();
                let mouseCanvas = {
                    "x": Math.floor((e.clientX-canvasRect.left)/cursor.width), 
                    "y": Math.floor((e.clientY-canvasRect.top)/cursor.height)
                };
                if (mouseCanvas.x != cursor.x || mouseCanvas.y != cursor.y) {
                    cursor.x = mouseCanvas.x;
                    cursor.y = mouseCanvas.y;
                    drawSelectedTileToCanvas();
                }

            }
        });
        document.getElementById('imageCanvas').addEventListener('click', (e) => {
            if (cursor.useCursor) {
                selectedTile.properties.subImageX = cursor.x*cursor.width;
                selectedTile.properties.subImageY = cursor.y*cursor.height;
                selectedTile.properties.subImageWidth = cursor.width;
                selectedTile.properties.subImageHeight = cursor.height;
                drawSelectedTileToCanvas();
                listTiles();
                setPropertiesList(document.getElementById('tilePropertiesUL'), selectedTile, 'tile');
            }
        });
});}

function importImage() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    myTileset.loadImageFromClient(function() {
        let newImage = myTileset._images[myTileset._images.length-1];
        let newImageLI = createImageLI(newImage, null);
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
            let index = myTileset._images.indexOf(newImage);
            for (let t of myTileset._isoTiles) {
                if (t.image == newImage) {
                    t.image = null;
                }
            }
            myTileset._images.splice(index, 1);
            listImages();
            listTiles();
            drawSelectedTileToCanvas();
        }
        document.getElementById('imagesUL').appendChild(newImageLI.li);
    });                    
});}

function newTile() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {

    let newTile = new isoTileNameSpace.IsoTile(null, null);
    myTileset._isoTiles.push(newTile);
    let newTileLI = createImageLI(newTile.image, null);
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
        if (selectedTile == newTile) { selectedTile = null; }
        let index = myTileset._isoTiles.indexOf(newTile);
        myTileset._isoTiles.splice(index, 1);
        listTiles();
        drawSelectedTileToCanvas();
    }

    document.getElementById('tilesUL').appendChild(newTileLI.li);
});}

function listImages() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    let imagesUL = document.getElementById('imagesUL');
    imagesUL.innerHTML = '';
    for (let i of myTileset._images) {
        let imgli = createImageLI(i, null);
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
            let index = myTileset._images.indexOf(i);
            for (let t of myTileset._isoTiles) {
                if (t.image == i) {
                    t.image = null;
                }
            }
            myTileset._images.splice(index, 1);
            listImages();
            listTiles();
            drawSelectedTileToCanvas();
        }
        imagesUL.appendChild(imgli.li); 
    }
});}

function listTiles() {requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    let tilesUL = document.getElementById('tilesUL');
    tilesUL.innerHTML = '';
    for (let t of myTileset._isoTiles) {
        let imgli = createImageLI(
            t.image, 
            {
                'x': t.properties.subImageX,
                'y': t.properties.subImageY,
                'width': t.properties.subImageWidth,
                'height': t.properties.subImageHeight
            });            
        imgli.canvas.onclick = (e) => {
            selectedTile = t;
            for (let l of e.target.parentNode.parentNode.children) {
                l.style.borderColor = 'black';
            }
            imgli.li.style.borderColor = 'red';
            setPropertiesList(document.getElementById('tilePropertiesUL'), t, 'tile');
            drawSelectedTileToCanvas();
        }
        imgli.button.onclick = (e) => {           
            if (selectedTile == t) { selectedTile = null; }
            let index = myTileset._isoTiles.indexOf(t);
            myTileset._isoTiles.splice(index, 1);
            listTiles();
            drawSelectedTileToCanvas();
        }
        if (t == selectedTile) {
            imgli.li.style.borderColor = 'red';
        }
        tilesUL.appendChild(imgli.li);
    }
});}

function loadSet() { requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {
    myTileset.dumbLoad(function() {
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

function newSet() {  requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {    
    myTileset = new isoTileSetNameSpace.IsoTileSet();
    selectedTile = null;
    selectedImage = null;
    document.getElementById('tilePropertiesUL').innerHTML = '';
    setPropertiesList(document.getElementById('tilesetPropertyUL'), myTileset, 'set');
    listImages();
    listTiles();
});}

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
                    drawSelectedTileToCanvas();
                    listTiles();
                }
            } else if (e.target.type == 'number') {
                if (!isNaN(parseFloat(e.target.value))) {
                    if (e.target['data-type'] == 'set') {
                        myTileset.properties[e.target['data-key']] = parseFloat(e.target.value);
                    } else {
                        selectedTile.properties[e.target['data-key']] = parseFloat(e.target.value);
                        drawSelectedTileToCanvas();
                        listTiles();
                    }                              
                }
            } else {                
                if (e.target['data-type'] == 'set') {
                    myTileset.properties[e.target['data-key']] = e.target.value;
                } else {
                    selectedTile.properties[e.target['data-key']] = e.target.value;
                    drawSelectedTileToCanvas();
                    listTiles();
                }
            }
        }
        dright.appendChild(inputE);        

        pli.appendChild(dleft);
        pli.appendChild(dright);
        propertiesUL.appendChild(pli);
    }
});}

function createImageLI(img, subImg) {
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
        if (subImg) {
            ctx2.drawImage(img, 
                subImg.x, subImg.y, subImg.width, subImg.height,
                0, 0, 50, 50
            );
        } else {
            ctx2.drawImage(img, 0, 0, 50, 50);
        }     
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
                selectedTile.properties.subImageWidth,
                selectedTile.properties.subImageHeight,
            );
            ctx.stroke();
            if (cursor.useCursor) {
                ctx.beginPath();
                ctx.strokeStyle='green';
                ctx.rect(
                    cursor.x*cursor.width,
                    cursor.y*cursor.height,
                    cursor.width,
                    cursor.height
                );
                ctx.stroke();
            }
        } else {           
            // hide canvas
            let c = document.getElementById('imageCanvas');
            c.width = 0;
            c.height = 0;
        }
    } else {
        // hide canvas
        let c = document.getElementById('imageCanvas');
        c.width = 0;
        c.height = 0;
    }
}

function playAnimation() { requirejs(['scripts/isotile','scripts/isotileset'], function(isoTileNameSpace, isoTileSetNameSpace) {

    if (myTileset.properties.isAnimation && myTileset.properties.fps > 0) {
        if (isAnimating) {
            isAnimating = false;
            document.getElementById('animationButton').innerHTML = 'Animate';
        } else {
            isAnimating = true;
            document.getElementById('animationButton').innerHTML = 'Stop';
            let imageLIS = document.getElementById('tilesUL').childNodes;
            let tileNum = 0;
            let numTiles = imageLIS.length;
            let timeoutFunction = function() {
                setTimeout(() => {
                    if (tileNum == numTiles) {
                        if (!myTileset.properties.animationLoops) {
                            isAnimating = false;
                            document.getElementById('animationButton').innerHTML = 'Animate';
                        }
                        tileNum = 0;
                    }
                    imageLIS[tileNum].getElementsByTagName('canvas')[0].click();
                    tileNum++;
                    if (isAnimating && (myTileset.properties.fps > 0)) {
                        timeoutFunction();
                    }
                }, 1000.0 / myTileset.properties.fps);
            }
            timeoutFunction();
        }
    }
});}
