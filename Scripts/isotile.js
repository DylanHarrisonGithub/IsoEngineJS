define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    // compile with 
    // tsc isotile --module amd
    var IsoTile = /** @class */ (function () {
        function IsoTile(img, params) {
            this.canStack = true;
            this.stackingHeight = 1.0;
            this.isClipped = true;
            this.isRamp = false;
            this.isSouthNorthRamp = false;
            this.isEastWestRamp = false;
            this.isHidden = false;
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
        return IsoTile;
    }());
    exports.IsoTile = IsoTile;
});
