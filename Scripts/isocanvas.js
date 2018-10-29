var IsoCanvas = /** @class */ (function () {
    function IsoCanvas(delagateDiv) {
        var _this = this;
        this._location = { 'x': 0, 'y': 0 };
        this._tileSize = { 'x': 64, 'y': 32 };
        this._doubleTileSizeInverse = { 'x': 1.0 / (2 * 64), 'y': 1.0 / (2 * 32) };
        this._zoom = 1.0;
        this._zoomInverse = 1.0;
        this._halfResolution = { 'x': 0, 'y': 0 };
        this._mouseCanvas = { 'x': 0, 'y': 0 };
        this._mouseCartesian = { 'x': 0, 'y': 0 };
        this._mouseIso = { 'x': 0, 'y': 0 };
        this.axesColor = '#000000';
        this.backgroundColor = '#ffffff';
        this.layers = [];
        this.tiles = [];
        this.showAxes = true;
        this.showGrid = true;
        this._div = delagateDiv;
        this._canvas = document.createElement('canvas');
        this._div.append(this._canvas);
        this._canvas.width = this._div.clientWidth;
        this._canvas.height = this._div.clientHeight;
        this._halfResolution.x = this._canvas.width / 2;
        this._halfResolution.y = this._canvas.height / 2;
        this._div.addEventListener('mousemove', function (ev) { _this.defaultMouseMoveListener(ev); });
        window.addEventListener('resize', function (ev) {
            _this._canvas.width = _this._div.clientWidth;
            _this._canvas.height = _this._div.clientHeight;
            _this._halfResolution.x = _this._canvas.width / 2;
            _this._halfResolution.y = _this._canvas.height / 2;
        });
    }
    // Transformations
    IsoCanvas.prototype.isoToCartesianCoords = function (isoCoord) {
        return {
            'x': this._tileSize.x * (isoCoord.x - isoCoord.y),
            'y': -this._tileSize.y * (isoCoord.x + isoCoord.y)
        };
    };
    IsoCanvas.prototype.cartesianToIso = function (cartesianCoord) {
        return {
            'x': cartesianCoord.x * this._doubleTileSizeInverse.x - cartesianCoord.y * this._doubleTileSizeInverse.y,
            'y': -(cartesianCoord.x * this._doubleTileSizeInverse.x + cartesianCoord.y * this._doubleTileSizeInverse.y)
        };
    };
    IsoCanvas.prototype.cartesianToCanvasCoords = function (cartesianCoord) {
        return {
            'x': (cartesianCoord.x - this._location.x) * this._zoom + this._canvas.width / 2,
            'y': -(cartesianCoord.y - this._location.y) * this._zoom + this._canvas.height / 2
        };
    };
    IsoCanvas.prototype.canvasToCartesianCoordinates = function (screenCoordinate) {
        return {
            'x': (screenCoordinate.x - this._halfResolution.x) * this._zoomInverse + this._location.x,
            'y': -(screenCoordinate.y - this._halfResolution.y) * this._zoomInverse + this._location.y
        };
    };
    ;
    IsoCanvas.prototype.isoToCanvasCoords = function (isoCoord) {
        return this.cartesianToCanvasCoords(this.isoToCartesianCoords(isoCoord));
    };
    // Drawing
    IsoCanvas.prototype.clearCanvas = function () {
        var ctx = this._canvas.getContext('2d');
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    };
    IsoCanvas.prototype.drawIsoTile = function (isoCoord, img) {
        var ctx = this._canvas.getContext('2d');
        var pX = this.cartesianToCanvasCoords(this.isoToCartesianCoords({ 'x': isoCoord.x - .5, 'y': isoCoord.y + .5 }));
        var size1 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({ 'x': 0, 'y': 1 }));
        var size2 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({ 'x': 1, 'y': 0 }));
        var size3 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({ 'x': 0, 'y': 0 }));
        var size4 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({ 'x': 1, 'y': 1 }));
        ctx.drawImage(img, pX.x, pX.y, size2.x - size1.x, size4.y - size3.y);
    };
    IsoCanvas.prototype.drawAxes = function () {
        var northWest = { "x": 0, "y": 0 };
        var southEast = { "x": this._canvas.width, "y": this._canvas.height };
        var canvas2dContext = this._canvas.getContext('2d');
        northWest = this.canvasToCartesianCoordinates(northWest);
        southEast = this.canvasToCartesianCoordinates(southEast);
        if ((northWest.x <= 0) && (southEast.x >= 0)) {
            var topCoord = { "x": 0, "y": northWest.y };
            var bottomCoord = { "x": 0, "y": southEast.y };
            topCoord = this.cartesianToCanvasCoords(topCoord);
            bottomCoord = this.cartesianToCanvasCoords(bottomCoord);
            canvas2dContext.strokeStyle = this.axesColor;
            canvas2dContext.beginPath();
            canvas2dContext.moveTo(topCoord.x, topCoord.y);
            canvas2dContext.lineTo(bottomCoord.x, bottomCoord.y);
            canvas2dContext.stroke();
        }
        if ((northWest.y >= 0) && (southEast.y <= 0)) {
            var leftCoord = { "x": northWest.x, "y": 0 };
            var rightCoord = { "x": southEast.x, "y": 0 };
            leftCoord = this.cartesianToCanvasCoords(leftCoord);
            rightCoord = this.cartesianToCanvasCoords(rightCoord);
            canvas2dContext.strokeStyle = this.axesColor;
            canvas2dContext.beginPath();
            canvas2dContext.moveTo(leftCoord.x, leftCoord.y);
            canvas2dContext.lineTo(rightCoord.x, rightCoord.y);
            canvas2dContext.stroke();
        }
    };
    IsoCanvas.prototype.paint = function () {
        this.clearCanvas();
        // draw tilemap
        for (var l = 0; l < this.layers.length; l++) {
            for (var y = 0; y < this.layers[l].length; y++) {
                for (var x = 0; x < this.layers[l][y].length; x++) {
                    this.drawIsoTile({ 'x': x, 'y': y }, this.tiles[this.layers[l][y][x]]);
                }
            }
        }
        if (this.showAxes) {
            this.drawAxes();
        }
        if (this.showGrid) {
            //this.drawGrid();
        }
    };
    // Event Listeners
    IsoCanvas.prototype.defaultMouseMoveListener = function (event) {
        var centerDivRect = this._div.getBoundingClientRect();
        this._mouseCanvas = { "x": event.clientX - centerDivRect.left, "y": event.clientY - centerDivRect.top };
        this._mouseCartesian = this.canvasToCartesianCoordinates(this._mouseCanvas);
        this._mouseIso = this.cartesianToIso(this._mouseCartesian);
    };
    IsoCanvas.prototype.defaultMouseWheelListener = function (event) {
        if (event.deltaY < 0) {
            this._zoom = this._zoom * (1.05);
            this._zoomInverse = 1.0 / this._zoom;
        }
        else {
            this._zoom = this._zoom * (0.95);
            this._zoomInverse = 1.0 / this._zoom;
        }
    };
    IsoCanvas.prototype.defaultMouseClickListener = function (event) {
        var centerDivRect = this._div.getBoundingClientRect();
        this._mouseCanvas = { "x": event.clientX - centerDivRect.left, "y": event.clientY - centerDivRect.top };
        this._mouseCartesian = this.canvasToCartesianCoordinates(this._mouseCanvas);
        this._location.x = this._mouseCartesian.x;
        this._location.y = this._mouseCartesian.y;
        //this._mouseCanvas = {"x": this._halfResolution.x, "y": this._halfResolution.y};
        //this._mouseCartesian = {"x": 0, "y": 0};
    };
    return IsoCanvas;
}());
