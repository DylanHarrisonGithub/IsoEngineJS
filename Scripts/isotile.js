define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    // compile with 
    // tsc isotile --module amd
    var IsoTile = /** @class */ (function () {
        function IsoTile(img, params) {
            this.subImage = { 'x': 0, 'y': 0, 'width': 0, 'height': 0 };
            this.canStack = true;
            this.stackingHeight = 1.0;
            this.isClipped = true;
            this.isRamp = false;
            this.isSouthNorthRamp = false;
            this.isEastWestRamp = false;
            this.isHidden = false;
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
        IsoTile.loadTileset = function (filenames, onload) {
            var images = [];
            var numImages = filenames.length;
            var loadedCounter = 0;
            for (var i = 0; i < filenames.length; i++) {
                images.push(new Image());
                images[images.length - 1].onload = function () {
                    loadedCounter++;
                    if (loadedCounter == numImages) {
                        var tileset = [];
                        for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                            var img = images_1[_i];
                            tileset.push(new IsoTile(img, null));
                        }
                        onload(tileset);
                    }
                };
            }
            for (var i = 0; i < filenames.length; i++) {
                images[i].src = filenames[i];
            }
        };
        return IsoTile;
    }());
    exports.IsoTile = IsoTile;
});
