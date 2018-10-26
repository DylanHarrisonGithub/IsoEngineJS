var IsoCanvas = /** @class */ (function () {
    function IsoCanvas(delagateDiv) {
        var _this = this;
        this._location = { 'x': 0, 'y': 0 };
        this._tileSize = { 'x': 64, 'y': 32 };
        this._zoom = 1.0;
        this._zoomInverse = 1.0;
        this._div = delagateDiv;
        this._canvas = document.createElement('canvas');
        this._div.append(this._canvas);
        this._canvas.width = this._div.clientWidth;
        this._canvas.height = this._div.clientHeight;
        window.addEventListener('resize', function (ev) {
            _this._canvas.width = _this._div.clientWidth;
            _this._canvas.height = _this._div.clientHeight;
        });
    }
    IsoCanvas.prototype.isoToCartesianCoords = function (isoCoord) {
        var cartesianCoord = {
            'x': this._tileSize.x * (isoCoord.x - isoCoord.y),
            'y': this._tileSize.y * (isoCoord.x + isoCoord.y)
        };
        return cartesianCoord;
    };
    IsoCanvas.prototype.cartesianToCanvasCoords = function (cartesianCoord) {
        var canvasCoord = {
            'x': cartesianCoord.x + this._canvas.width / 2,
            'y': cartesianCoord.y + this._canvas.height / 6
        };
        return canvasCoord;
    };
    IsoCanvas.prototype.isoToCanvasCoords = function (isoCoord) {
        return this.cartesianToCanvasCoords(this.isoToCartesianCoords(isoCoord));
    };
    IsoCanvas.prototype.drawIsoTile = function (isoCoord, img) {
        var ctx = this._canvas.getContext('2d');
        var pX = this.cartesianToCanvasCoords(this.isoToCartesianCoords({ 'x': isoCoord.x, 'y': isoCoord.y + 1 }));
        var pY = this.cartesianToCanvasCoords(this.isoToCartesianCoords({ 'x': isoCoord.x, 'y': isoCoord.y }));
        var sizeX = this.isoToCartesianCoords({ 'x': 2, 'y': 0 });
        var sizeY = this.isoToCartesianCoords({ 'x': 1, 'y': 1 });
        ctx.drawImage(img, pX.x, pY.y, sizeX.x, sizeY.y);
    };
    return IsoCanvas;
}());
