// compile with 
// tsc isotile --module amd
export class IsoTile {

    public image: HTMLImageElement;
    public subImage = {'x': 0, 'y': 0, 'width': 0, 'height': 0}; 
    public canStack = true;
    public stackingHeight = 1.0;
    public isClipped = true;
    public isRamp = false;
    public isSouthNorthRamp = false;
    public isEastWestRamp = false;
    public isHidden = false;

    constructor(img: HTMLImageElement, params: Object) {

        this.image = img;
        this.subImage.x = 0;
        this.subImage.y = 0;
        this.subImage.width = this.image.width;
        this.subImage.height = this.image.height;

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
            if ('subImage' in params) {
                if (('x' in params['subImage']) && ('y' in params['subImage'])) {
                    this.subImage.x = params['subImage']['x'];
                    this.subImage.y = params['subImage']['y'];
                }
                if (('width' in params['subImage']) && ('height' in params['subImage'])) {
                    this.subImage.width = params['subImage']['width'];
                    this.subImage.height = params['subImage']['height'];
                }
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