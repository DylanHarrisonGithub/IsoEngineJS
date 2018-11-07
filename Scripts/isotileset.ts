// compile with 
// tsc isotileset --module amd
import isoTile = require('./isotile');
export class IsoTileSet {

    public isoTileSetName = 'untitledTileset';
    private _images: HTMLImageElement[] = [];
    private _isoTiles: isoTile.IsoTile[] = [];

    constructor() {        
    }

    loadImageFile(filenames: string[], onload: Function) {

    }

    static loadIsoTileSet(filename: string, onload: Function) {
        fetch(filename).then(res => res.json()).then(data => {            
            if (('isoTileSetName' in data) && ('imageFileNames' in data) && ('isoTilesData' in data)) {
                if (typeof data.isoTileSetName == 'string' &&
                    data.imageFileNames instanceof Array &&
                    data.isoTilesData instanceof Array) {

                        let loadedTileSet = new IsoTileSet();
                        loadedTileSet.isoTileSetName = data.isoTileSetName;

                        let images = [];
                        let numImages = data.imageFileNames.length;
                        let loadedCounter = 0;

                        for (let i = 0; i < numImages; i++) {

                            images.push(new Image());
                            images[images.length-1].onload = function() {

                                loadedCounter++;
                                if (loadedCounter == numImages) {

                                    loadedTileSet._images = images;

                                    for (let tileData of data.isoTilesData) {
                                        if (loadedTileSet._images.find(it => it.src == tileData.imageFileName) != undefined) {
                                            loadedTileSet._isoTiles.push(new isoTile.IsoTile(
                                                loadedTileSet._images.find(it => it.src == tileData.imageFileName),
                                                tileData.tileProperties
                                            ));
                                        }
                                    }
                                    onload(loadedTileSet);
                                }
                            }
                            images[images.length-1].onerror = function() {
                                //console.log('image did not load');
                                numImages--;
                            }

                        }
                        for (let i = 0; i < data.imageFileNames.length; i++) {            
                            images[i].src = data.imageFileNames[i];
                        }

                    } else {                        
                        alert('b invalid tileset');
                    }
            } else {
                alert('a invalid tileset');
            }
        }).catch(error => alert('invalid tileset: ' + error));
    }

    mergeLoad() {

    }

    save() {

        let filename = this.isoTileSetName + '.json';
        let imageFileNames = [];
        for (let img of this._images) {
            imageFileNames.push(img.src);
        }

        let isoTilesData = [];
        for (let tile of this._isoTiles) {
            isoTilesData.push({
                'imageFileName': tile.image.src,
                'tileProperties': tile.properties
            });
        }

        let file = new Blob([JSON.stringify({
            'isoTileSetName': this.isoTileSetName,
            'imageFileNames': imageFileNames,
            'isoTilesData': isoTilesData
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

}