define(["require", "exports", "./isotile"], function (require, exports, isoTile) {
    "use strict";
    exports.__esModule = true;
    var IsoTileSet = /** @class */ (function () {
        function IsoTileSet() {
            this.isoTileSetName = 'untitledTileset';
            this._images = [];
            this._isoTiles = [];
        }
        IsoTileSet.prototype.loadImageFile = function (filenames, onload) {
        };
        IsoTileSet.loadIsoTileSet = function (filename, onload) {
            fetch(filename).then(function (res) { return res.json(); }).then(function (data) {
                if (('isoTileSetName' in data) && ('imageFileNames' in data) && ('isoTilesData' in data)) {
                    if (typeof data.isoTileSetName == 'string' &&
                        data.imageFileNames instanceof Array &&
                        data.isoTilesData instanceof Array) {
                        var loadedTileSet_1 = new IsoTileSet();
                        loadedTileSet_1.isoTileSetName = data.isoTileSetName;
                        var images_1 = [];
                        var numImages_1 = data.imageFileNames.length;
                        var loadedCounter_1 = 0;
                        for (var i = 0; i < numImages_1; i++) {
                            images_1.push(new Image());
                            images_1[images_1.length - 1].onload = function () {
                                loadedCounter_1++;
                                if (loadedCounter_1 == numImages_1) {
                                    loadedTileSet_1._images = images_1;
                                    var _loop_1 = function (tileData) {
                                        if (loadedTileSet_1._images.find(function (it) { return it.src == tileData.imageFileName; }) != undefined) {
                                            loadedTileSet_1._isoTiles.push(new isoTile.IsoTile(loadedTileSet_1._images.find(function (it) { return it.src == tileData.imageFileName; }), tileData.tileProperties));
                                        }
                                    };
                                    for (var _i = 0, _a = data.isoTilesData; _i < _a.length; _i++) {
                                        var tileData = _a[_i];
                                        _loop_1(tileData);
                                    }
                                    onload(loadedTileSet_1);
                                }
                            };
                            images_1[images_1.length - 1].onerror = function () {
                                //console.log('image did not load');
                                numImages_1--;
                            };
                        }
                        for (var i = 0; i < data.imageFileNames.length; i++) {
                            images_1[i].src = data.imageFileNames[i];
                        }
                    }
                    else {
                        alert('b invalid tileset');
                    }
                }
                else {
                    alert('a invalid tileset');
                }
            })["catch"](function (error) { return alert('invalid tileset: ' + error); });
        };
        IsoTileSet.prototype.mergeLoad = function () {
        };
        IsoTileSet.prototype.save = function () {
            var filename = this.isoTileSetName + '.json';
            var imageFileNames = [];
            for (var _i = 0, _a = this._images; _i < _a.length; _i++) {
                var img = _a[_i];
                imageFileNames.push(img.src);
            }
            var isoTilesData = [];
            for (var _b = 0, _c = this._isoTiles; _b < _c.length; _b++) {
                var tile = _c[_b];
                isoTilesData.push({
                    'imageFileName': tile.image.src,
                    'tileProperties': tile.properties
                });
            }
            var file = new Blob([JSON.stringify({
                    'isoTileSetName': this.isoTileSetName,
                    'imageFileNames': imageFileNames,
                    'isoTilesData': isoTilesData
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
        return IsoTileSet;
    }());
    exports.IsoTileSet = IsoTileSet;
});
