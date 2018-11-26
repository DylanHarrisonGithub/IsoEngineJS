define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    // compile with 
    // tsc isotile --module amd
    var IsoTile = /** @class */ (function () {
        function IsoTile(img, params) {
            this.properties = {
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
                for (var key in params) {
                    if (key in this.properties) {
                        this.properties[key] = params[key];
                    }
                }
            }
            // enforce cell height law
            this.calculateCellHeight();
        }
        IsoTile.prototype.calculateCellHeight = function () {
            var hwRatio = this.properties.subImageHeight / this.properties.subImageWidth;
            this.properties.cellHeight = ((2 * hwRatio - 1) * this.properties.cellWidth + (2 * hwRatio - 1) * this.properties.cellBreadth) / 2;
        };
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
