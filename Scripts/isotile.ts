// compile with 
// tsc isotile --module amd
export class IsoTile {

    public image: HTMLImageElement;
    public properties = {
        'subImage': {'x': 0, 'y': 0, 'width': 0, 'height': 0},
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
        this.properties.subImage.x = 0;
        this.properties.subImage.y = 0;
        this.properties.subImage.width = this.image.width;
        this.properties.subImage.height = this.image.height;

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
            if ('subImage' in params) {
                if (('x' in params['subImage']) && ('y' in params['subImage'])) {
                    this.properties.subImage.x = params['subImage']['x'];
                    this.properties.subImage.y = params['subImage']['y'];
                }
                if (('width' in params['subImage']) && ('height' in params['subImage'])) {
                    this.properties.subImage.width = params['subImage']['width'];
                    this.properties.subImage.height = params['subImage']['height'];
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