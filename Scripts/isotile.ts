// compile with 
// tsc isotile --module amd
export class IsoTile {

    public image: HTMLImageElement;
    public properties = {
        'subImageX': 0,
        'subImageY': 0,
        'subImageWidth': 0,
        'subImageHeight': 0,
        'canStack': true,
        'stackingHeight': 1.0,
        'isClipped': true,
        'isRamp': false,
        'isSouthNorthRamp': false,
        'isEastWestRamp': false,
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
            if ('canStack' in params) {
                this.properties.canStack = params['canStack'];
            }
            if ('stackingHeight' in params) {
                this.properties.stackingHeight = params['stackingHeight'];
            }
            if ('isClipped' in params) {
                this.properties.isClipped = params['isClipped'];
            }
            if ('isRamp' in params) {
                this.properties.isRamp = params['isRamp'];
            }
            if ('isSouthNorthRamp' in params) {
                this.properties.isSouthNorthRamp = params['isSouthNorthRamp'];
            }
            if ('isEastWestRamp' in params) {
                this.properties.isEastWestRamp = params['isEastWestRamp'];
            }        
            if ('isHidden' in params) {
                this.properties.isHidden = params['isHidden'];
            }
            if ('subImageX' in params) {
                this.properties.subImageX = params['subImageX'];
            }            
            if ('subImageY' in params) {
                this.properties.subImageX = params['subImageY'];
            }            
            if ('subImageWidth' in params) {
                this.properties.subImageX = params['subImageWidth'];
            }            
            if ('subImageHeight' in params) {
                this.properties.subImageX = params['subImageHeight'];
            }
        }
    }

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