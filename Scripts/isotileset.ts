// compile with 
// tsc isotileset --module amd
import isoTile = require('./isotile');
export class IsoTileSet {

    public properties = {
        tileSetName: 'untitled set',
        isAnimation: false,
        animationLoops: false,
        fps: 0.0
    };
    private _images: HTMLImageElement[] = [];
    private _isoTiles: isoTile.IsoTile[] = [];

    constructor() {        
    }

    loadImageFromClient(onload: Function) { 
        let inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'file');
        inputElement.setAttribute('style', 'display:none');
        inputElement.addEventListener('change', (ev) => {
            if (inputElement.files.length > 0) {
                let newImage = new Image();
                var reader = new FileReader();
                reader.onload = ((event) => {
                    newImage.src = (<any>event.target).result;
                    newImage.onload = ((event) => {
                        this._images.push(newImage);
                        onload();
                    });
                });
                reader.readAsDataURL(inputElement.files[0]);
            }
        }, false);
        document.body.appendChild(inputElement);
        inputElement.click();
        setTimeout(function() {
            document.body.removeChild(inputElement);  
        }, 0);        
    }

    dumbSave() {

        let filename = this.properties.tileSetName + '.json';
        
        let images = [];
        for (let img of this._images) {
            images.push(img.src);
        }
        
        let tiles = [];
        for (let tile of this._isoTiles) {
            tiles.push({
                'index': this._images.indexOf(tile.image),
                'properties': tile.properties
            });
        }
        let file = new Blob([JSON.stringify({
            'properties': this.properties,
            'images': images,
            'tiles': tiles            
        })], {type: 'application/json'});        
        let anchor = document.createElement('a');
        anchor.setAttribute('style', 'display:none');
        let url = URL.createObjectURL(file);
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(function() {
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);  
        }, 0);        
    }

    dumbLoad(onloaded: Function) {
        let inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'file');
        inputElement.setAttribute('style', 'display:none');
        inputElement.addEventListener('change', (ev) => {
            if (inputElement.files.length > 0) {
                var reader = new FileReader();
                reader.onload = ((event) => {
                    let file = JSON.parse((<any>event.target).result);
                    this.properties = file.properties;
                    
                    this._images = [];                    
                    let numImages = file.images.length;
                    let loadedCounter = 0;
                    for (let fileImg of file.images) {
                        let newImage = new Image();
                        this._images.push(newImage);
                        newImage.onload = ((event) => {
                            loadedCounter++;
                            if (loadedCounter == numImages) {
                                this._isoTiles = [];
                                for (let tile of file.tiles) {
                                    this._isoTiles.push(new isoTile.IsoTile(
                                        this._images[tile.index],
                                        tile.properties
                                    ));
                                    //console.log(tile);
                                }
                                onloaded();
                            }
                        });
                        newImage.onerror = function() {
                            console.log('image did not load');
                            numImages--;
                        }
                        newImage.src = fileImg;
                    }
                    //onloaded();
                });
                reader.readAsText(inputElement.files[0]);
            }
        }, false);
        document.body.appendChild(inputElement);
        inputElement.click();
        setTimeout(function() {
            document.body.removeChild(inputElement);  
        }, 0);        
    }

    loadFromServer(filename: string, onload: Function) {
        fetch(filename).then(res => res.json()).then(file => {
            this.properties = file.properties;
            this._images = [];                    
            let numImages = file.images.length;
            //console.log('numImages: ', numImages);
            let loadedCounter = 0;
            for (let fileImg of file.images) {
                let newImage = new Image();
                this._images.push(newImage);
                newImage.onload = ((event) => {
                    newImage.onload = null;
                    loadedCounter++;
                    //console.log('loading progress: ', loadedCounter);
                    if (loadedCounter == numImages) {
                        this._isoTiles = [];
                        for (let tile of file.tiles) {
                            this._isoTiles.push(new isoTile.IsoTile(
                                this._images[tile.index],
                                tile.properties
                            ));
                        }
                        //console.log('tileset loading complete');
                        onload();
                    }
                });
                newImage.onerror = function(e) {
                    console.log('image did not load', e);
                    numImages--;
                }
                newImage.src = fileImg;
            }
            //onload();
        });
    }

}