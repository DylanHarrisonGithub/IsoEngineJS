// compile with 
// tsc isotile --module amd
export class IsoTile {

    public image: HTMLImageElement;
    public properties = {
        'cellWidth': 1,
        'cellBreadth': 1,
        'cellHeight': 1,
        'subImageX': 0,
        'subImageY': 0,
        'subImageWidth': 0,
        'subImageHeight': 0,
        'canStack': true,
        'stackingHeight': 1.0,
        'isClipped': true,
        'isRamp': false,
        'isSouthUpToNorthRamp': false,
        'isEastUpToWestRamp': false,
        'isNorthUpToSouthRamp': false,
        'isWestUpToEastRamp': false,
        'isHidden': false, 
    }

    constructor(img: HTMLImageElement, params: Object) {

        this.image = img;
        this.properties.subImageX = 0;
        this.properties.subImageY = 0;
        if (img) {
            this.properties.subImageWidth = this.image.width;
            this.properties.subImageHeight = this.image.height;
        }

        if (params) {
            for (let key in params) {
                if (key in this.properties) {
                    this.properties[key] = params[key];
                }
            }
        }

        // enforce cell height law
        this.calculateCellHeight();
    }

    calculateCellHeight() {
        let hwRatio = this.properties.subImageHeight / this.properties.subImageWidth;
        this.properties.cellHeight = ((2*hwRatio-1)*this.properties.cellWidth + (2*hwRatio-1)*this.properties.cellBreadth) / 2;        
    }

    //deprecated
    static loadTileset(filenames: string[], onload: (tileset: IsoTile[]) => void) {

        var images: HTMLImageElement[] = [];
        var numImages = filenames.length;
        var loadedCounter = 0;

        for (let i = 0; i < filenames.length; i++) {

            images.push(new Image());
            images[images.length-1].onload = function() {

                loadedCounter++;
                if (loadedCounter == numImages) {

                    var tileset: IsoTile[] = [];
                    for (var img of images) {
                        tileset.push(new IsoTile(img, null));
                    }
                    onload(tileset);
                }
            }

        }
        for (let i = 0; i < filenames.length; i++) {            
            images[i].src = filenames[i];
        }
    }

}