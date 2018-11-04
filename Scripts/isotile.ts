// compile with 
// tsc isotile --module amd
export class IsoTile {

    image: HTMLImageElement;
    canStack = true;
    stackingHeight = 1.0;
    isClipped = true;
    isRamp = false;
    isSouthNorthRamp = false;
    isEastWestRamp = false;
    isHidden = false;

    constructor(img: HTMLImageElement, params: Object) {

        this.image = img;

        if (params) {
            if ('canStack' in params) {
                this.canStack = params['canStack'];
            }
            if ('stackingHeight' in params) {
                this.stackingHeight = params['stackingHeight'];
            }
            if ('isClipped' in params) {
                this.isClipped = params['isClipped'];
            }
            if ('isRamp' in params) {
                this.isRamp = params['isRamp'];
            }
            if ('isSouthNorthRamp' in params) {
                this.isSouthNorthRamp = params['isSouthNorthRamp'];
            }
            if ('isEastWestRamp' in params) {
                this.isEastWestRamp = params['isEastWestRamp'];
            }        
            if ('isHidden' in params) {
                this.isHidden = params['isHidden'];
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