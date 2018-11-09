define(["require", "exports", "./isotile"], function (require, exports, isoTile) {
    "use strict";
    exports.__esModule = true;
    var IsoTileSet = /** @class */ (function () {
        function IsoTileSet() {
            this.isoTileSetName = 'untitledTileset';
            this._images = [];
            this._isoTiles = [];
        }
        IsoTileSet.prototype.loadImageFromClient = function (onload) {
            var _this = this;
            var inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'file');
            inputElement.setAttribute('style', 'display:none');
            inputElement.addEventListener('change', function (ev) {
                if (inputElement.files.length > 0) {
                    var newImage_1 = new Image();
                    var reader = new FileReader();
                    reader.onload = (function (event) {
                        newImage_1.src = event.target.result;
                        newImage_1.onload = (function (event) {
                            _this._images.push(newImage_1);
                            onload();
                        });
                    });
                    reader.readAsDataURL(inputElement.files[0]);
                }
            }, false);
            document.body.appendChild(inputElement);
            inputElement.click();
            setTimeout(function () {
                document.body.removeChild(inputElement);
            }, 0);
        };
        IsoTileSet.prototype.dumbSave = function () {
            var filename = this.isoTileSetName + '.json';
            var images = [];
            for (var _i = 0, _a = this._images; _i < _a.length; _i++) {
                var img = _a[_i];
                images.push(img.src);
            }
            var tiles = [];
            for (var _b = 0, _c = this._isoTiles; _b < _c.length; _b++) {
                var tile = _c[_b];
                tiles.push({
                    'index': this._images.indexOf(tile.image),
                    'properties': tile.properties
                });
            }
            var file = new Blob([JSON.stringify({
                    'isoTileSetName': this.isoTileSetName,
                    'images': images,
                    'tiles': tiles
                })], { type: 'application/json' });
            var anchor = document.createElement('a');
            anchor.setAttribute('style', 'display:none');
            var url = URL.createObjectURL(file);
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            setTimeout(function () {
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(url);
            }, 0);
        };
        IsoTileSet.prototype.dumbLoad = function (onload) {
            var _this = this;
            var inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'file');
            inputElement.setAttribute('style', 'display:none');
            inputElement.addEventListener('change', function (ev) {
                if (inputElement.files.length > 0) {
                    var reader = new FileReader();
                    reader.onload = (function (event) {
                        var file = JSON.parse(event.target.result);
                        _this.isoTileSetName = file.isoTileSetName;
                        _this._images = [];
                        var numImages = file.images.length;
                        var loadedCounter = 0;
                        for (var _i = 0, _a = file.images; _i < _a.length; _i++) {
                            var fileImg = _a[_i];
                            var newImage = new Image();
                            _this._images.push(newImage);
                            newImage.onload = (function (event) {
                                loadedCounter++;
                                if (loadedCounter == numImages) {
                                    _this._isoTiles = [];
                                    for (var _i = 0, _a = file.tiles; _i < _a.length; _i++) {
                                        var tile = _a[_i];
                                        _this._isoTiles.push(new isoTile.IsoTile(_this._images[tile.index], tile.properties));
                                    }
                                    onload();
                                }
                            });
                            newImage.onerror = function () {
                                console.log('image did not load');
                                numImages--;
                            };
                            newImage.src = fileImg;
                        }
                        onload();
                    });
                    reader.readAsText(inputElement.files[0]);
                }
            }, false);
            document.body.appendChild(inputElement);
            inputElement.click();
            setTimeout(function () {
                document.body.removeChild(inputElement);
            }, 0);
        };
        return IsoTileSet;
    }());
    exports.IsoTileSet = IsoTileSet;
});
