define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    // compile with 
    // tsc isotile --module amd
    var IsoTile = /** @class */ (function () {
        function IsoTile(img, params) {
            this.properties = {
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
                'isHidden': false
            };
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
