define(["require", "exports", "./isotile"], function (require, exports, isoTile) {
    "use strict";
    exports.__esModule = true;
    var IsoCanvas = /** @class */ (function () {
        function IsoCanvas(delagateDiv) {
            var _this = this;
            this._location = { 'x': 0, 'y': 0 };
            this._cellSize = { 'x': 64, 'y': 32 }; // = 1/2 cell (width, height)
            this._doubleCellSizeInverse = { 'x': 1.0 / (2 * this._cellSize.x), 'y': 1.0 / (2 * this._cellSize.y) };
            this._canvasTileSize = { 'x': this._cellSize.x, 'y': this._cellSize.y };
            this._zoom = 1.0;
            this._zoomInverse = 1.0;
            this._halfResolution = { 'x': 0, 'y': 0 };
            this._mouseCanvas = { 'x': 0, 'y': 0 };
            this._mouseCartesian = { 'x': 0, 'y': 0 };
            this._mouseIso = { 'x': 0, 'y': 0 };
            this._mouseCell = { 'x': 0, 'y': 0 };
            this._isoRotation = 0;
            this.axesColor = '#000000';
            this.gridColor = '#A0A0C0';
            this.backgroundColor = '#ffffff';
            this.map = [];
            this._heightMap = [];
            this.tiles = [];
            this.tileSetNames = [];
            this.showAxes = true;
            this.showGrid = true;
            this._relativeIsoRotationDirections = [
                [
                    { 'x': 1, 'y': -1 },
                    { 'x': 0, 'y': -1 },
                    { 'x': -1, 'y': -1 },
                    { 'x': -1, 'y': 0 },
                    { 'x': -1, 'y': 1 },
                    { 'x': 0, 'y': 1 },
                    { 'x': 1, 'y': 1 },
                    { 'x': 1, 'y': 0 } // 315deg
                ],
                [
                    { 'x': 1, 'y': 1 },
                    { 'x': 1, 'y': 0 },
                    { 'x': 1, 'y': -1 },
                    { 'x': 0, 'y': -1 },
                    { 'x': -1, 'y': -1 },
                    { 'x': -1, 'y': 0 },
                    { 'x': -1, 'y': 1 },
                    { 'x': 0, 'y': 1 } // 315deg
                ],
                [
                    { 'x': -1, 'y': 1 },
                    { 'x': 0, 'y': 1 },
                    { 'x': 1, 'y': 1 },
                    { 'x': 1, 'y': 0 },
                    { 'x': 1, 'y': -1 },
                    { 'x': 0, 'y': -1 },
                    { 'x': -1, 'y': -1 },
                    { 'x': -1, 'y': 0 } // 315deg            
                ],
                [
                    { 'x': -1, 'y': -1 },
                    { 'x': -1, 'y': 0 },
                    { 'x': -1, 'y': 1 },
                    { 'x': 0, 'y': 1 },
                    { 'x': 1, 'y': 1 },
                    { 'x': 1, 'y': 0 },
                    { 'x': 1, 'y': -1 },
                    { 'x': 0, 'y': -1 } // 315deg 
                ]
            ];
            this._div = delagateDiv;
            this._canvas = document.createElement('canvas');
            this._div.append(this._canvas);
            this._canvas.width = this._div.clientWidth;
            this._canvas.height = this._div.clientHeight;
            this._halfResolution.x = this._canvas.width / 2;
            this._halfResolution.y = this._canvas.height / 2;
            var size1 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': this._relativeIsoRotationDirections[this._isoRotation][5].x,
                'y': this._relativeIsoRotationDirections[this._isoRotation][5].y
            }));
            var size2 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': this._relativeIsoRotationDirections[this._isoRotation][7].x,
                'y': this._relativeIsoRotationDirections[this._isoRotation][7].y
            }));
            var size3 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': 0,
                'y': 0
            }));
            var size4 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': this._relativeIsoRotationDirections[this._isoRotation][6].x,
                'y': this._relativeIsoRotationDirections[this._isoRotation][6].y
            }));
            this._canvasTileSize.x = size2.x - size1.x;
            this._canvasTileSize.y = size4.y - size3.y;
            // dummy invisible tiles for filler spaces
            //this.tiles.push(new isoTile.IsoTile(null, {isHidden: true, canStack: false}));
            //this.tiles.push(new isoTile.IsoTile(null, {isHidden: true}));
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
            switch (this._isoRotation) {
                case 0: {
                    // r=4n+0
                    // [ cx, -cx][x]
                    // [-cy, -cy][y]             
                    return {
                        'x': this._cellSize.x * (isoCoord.x - isoCoord.y),
                        'y': -this._cellSize.y * (isoCoord.x + isoCoord.y)
                    };
                }
                case 1: {
                    // r=4n+1
                    // [ cx,  cx][x]
                    // [ cy, -cy][y]
                    return {
                        'x': this._cellSize.x * (isoCoord.x + isoCoord.y),
                        'y': this._cellSize.y * (isoCoord.x - isoCoord.y)
                    };
                }
                case 2: {
                    // r=4n+2
                    // [-cx,  cx][x]
                    // [ cy,  cy][y]             
                    return {
                        'x': this._cellSize.x * (-isoCoord.x + isoCoord.y),
                        'y': this._cellSize.y * (isoCoord.x + isoCoord.y)
                    };
                }
                default: {
                    // r=4n+3
                    // [-cx, -cx][x]
                    // [-cy,  cy][y]
                    return {
                        'x': -this._cellSize.x * (isoCoord.x + isoCoord.y),
                        'y': this._cellSize.y * (-isoCoord.x + isoCoord.y)
                    };
                }
            }
        };
        IsoCanvas.prototype.cartesianToIsoCoords = function (cartesianCoord) {
            switch (this._isoRotation) {
                case 0: {
                    // r=4n+0
                    // [ 2icx, -2icy][x]
                    // [-2icx, -2icy][y]                    
                    return {
                        'x': this._doubleCellSizeInverse.x * cartesianCoord.x - this._doubleCellSizeInverse.y * cartesianCoord.y,
                        'y': -(this._doubleCellSizeInverse.x * cartesianCoord.x + this._doubleCellSizeInverse.y * cartesianCoord.y)
                    };
                }
                case 1: {
                    // r=4n+1
                    // [ 2icx, 2icy][x]
                    // [ 2icx,-2icy][y]
                    return {
                        'x': this._doubleCellSizeInverse.x * cartesianCoord.x + this._doubleCellSizeInverse.y * cartesianCoord.y,
                        'y': this._doubleCellSizeInverse.x * cartesianCoord.x - this._doubleCellSizeInverse.y * cartesianCoord.y
                    };
                }
                case 2: {
                    // r=4n+2
                    // [-(2icx)  (2icy)][x]
                    // [ (2icx)  (2icy)][y]
                    return {
                        'x': -this._doubleCellSizeInverse.x * cartesianCoord.x + this._doubleCellSizeInverse.y * cartesianCoord.y,
                        'y': this._doubleCellSizeInverse.x * cartesianCoord.x + this._doubleCellSizeInverse.y * cartesianCoord.y
                    };
                }
                default: {
                    // r=4n+3
                    // [-2icx, -2icy][x]
                    // [-2icx,  2icy][y]
                    return {
                        'x': -this._doubleCellSizeInverse.x * cartesianCoord.x - this._doubleCellSizeInverse.y * cartesianCoord.y,
                        'y': -this._doubleCellSizeInverse.x * cartesianCoord.x + this._doubleCellSizeInverse.y * cartesianCoord.y
                    };
                }
            }
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
        IsoCanvas.prototype.canvasToIsoCoords = function (canvasCoord) {
            return this.cartesianToIsoCoords(this.canvasToCartesianCoordinates(canvasCoord));
        };
        IsoCanvas.prototype.setRotation = function (r) {
            if (r >= 0) {
                var isoLoc = this.cartesianToIsoCoords(this._location);
                this._isoRotation = Math.floor(r) % 4;
                var size1 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                    'x': this._relativeIsoRotationDirections[this._isoRotation][5].x,
                    'y': this._relativeIsoRotationDirections[this._isoRotation][5].y
                }));
                var size2 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                    'x': this._relativeIsoRotationDirections[this._isoRotation][7].x,
                    'y': this._relativeIsoRotationDirections[this._isoRotation][7].y
                }));
                var size3 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                    'x': 0,
                    'y': 0
                }));
                var size4 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                    'x': this._relativeIsoRotationDirections[this._isoRotation][6].x,
                    'y': this._relativeIsoRotationDirections[this._isoRotation][6].y
                }));
                this._canvasTileSize.x = size2.x - size1.x;
                this._canvasTileSize.y = size4.y - size3.y;
                this._location = this.isoToCartesianCoords(isoLoc);
                this.paint();
            }
        };
        // Drawing
        IsoCanvas.prototype.clearCanvas = function (ctx) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        };
        IsoCanvas.prototype.highlightCell = function (isoCoord, ctx) {
            var a = this.isoToCanvasCoords({
                'x': isoCoord.x,
                'y': isoCoord.y
            });
            var b = this.isoToCanvasCoords({
                'x': isoCoord.x + 1,
                'y': isoCoord.y
            });
            var c = this.isoToCanvasCoords({
                'x': isoCoord.x + 1,
                'y': isoCoord.y + 1
            });
            var d = this.isoToCanvasCoords({
                'x': isoCoord.x,
                'y': isoCoord.y + 1
            });
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(d.x, d.y);
            ctx.closePath();
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
        };
        IsoCanvas.prototype.drawIsoTile = function (isoCoord, tile, ctx) {
            if (tile && tile.image && !tile.properties.isHidden) {
                // todo: optimize with algebra
                // x coord of leftmost lowest tile
                var cX = this.isoToCanvasCoords({
                    'x': isoCoord.x + 0.5
                        + (tile.properties.cellWidth - 1) * this._relativeIsoRotationDirections[this._isoRotation][3].x
                        + this._relativeIsoRotationDirections[this._isoRotation][2].x
                        + this._relativeIsoRotationDirections[this._isoRotation][3].x,
                    'y': isoCoord.y + 0.5
                        + (tile.properties.cellWidth - 1) * this._relativeIsoRotationDirections[this._isoRotation][3].y
                        + this._relativeIsoRotationDirections[this._isoRotation][2].y
                        + this._relativeIsoRotationDirections[this._isoRotation][3].y
                });
                // y coord of uppermost tile
                var cY = this.isoToCanvasCoords({
                    'x': isoCoord.x + 0.5
                        + (tile.properties.cellWidth - 1) * this._relativeIsoRotationDirections[this._isoRotation][3].x
                        + (tile.properties.cellBreadth - 1) * this._relativeIsoRotationDirections[this._isoRotation][1].x
                        + (tile.properties.cellHeight - 1) * this._relativeIsoRotationDirections[this._isoRotation][2].x
                        + this._relativeIsoRotationDirections[this._isoRotation][2].x
                        + this._relativeIsoRotationDirections[this._isoRotation][3].x,
                    'y': isoCoord.y + 0.5
                        + (tile.properties.cellWidth - 1) * this._relativeIsoRotationDirections[this._isoRotation][3].y
                        + (tile.properties.cellBreadth - 1) * this._relativeIsoRotationDirections[this._isoRotation][1].y
                        + (tile.properties.cellHeight - 1) * this._relativeIsoRotationDirections[this._isoRotation][2].y
                        + this._relativeIsoRotationDirections[this._isoRotation][2].y
                        + this._relativeIsoRotationDirections[this._isoRotation][3].y
                });
                ctx.drawImage(tile.image, tile.properties.subImageX, tile.properties.subImageY, tile.properties.subImageWidth, tile.properties.subImageHeight, cX.x, cY.y, (0.5 * tile.properties.cellWidth + 0.5 * tile.properties.cellBreadth) * this._canvasTileSize.x, (0.25 * tile.properties.cellWidth + 0.25 * tile.properties.cellBreadth + 0.5 * tile.properties.cellHeight) * this._canvasTileSize.x);
            }
        };
        IsoCanvas.prototype.drawIsoTilesWithinCanvasFrame = function (ctx) {
            if (!this.map[0]) {
                return;
            }
            ;
            // get isometric coordinates of canvas boundary corners
            // a----b
            // |    |
            // d----c
            var a = this.canvasToIsoCoords({ "x": 0, "y": 0 });
            var b = this.canvasToIsoCoords({ 'x': this._canvas.width, 'y': 0 });
            var c = this.canvasToIsoCoords({ "x": this._canvas.width, "y": this._canvas.height });
            var d = this.canvasToIsoCoords({ 'x': 0, 'y': this._canvas.height });
            // adjust so that corners form a perfect rectangle
            a.x = Math.floor(a.x);
            a.y = Math.floor(a.y);
            b.x = Math.floor(b.x);
            b.y = a.y - b.x + a.x;
            c.y = Math.floor(c.y);
            c.x = c.y - b.y + b.x;
            d.x = ((c.x + c.y) + (a.x - a.y)) / 2; // ?prove always divisible?
            d.y = ((c.x + c.y) - (a.x - a.y)) / 2;
            a.x += this._relativeIsoRotationDirections[this._isoRotation][3].x;
            a.y += this._relativeIsoRotationDirections[this._isoRotation][3].y;
            b.x += this._relativeIsoRotationDirections[this._isoRotation][1].x;
            b.y += this._relativeIsoRotationDirections[this._isoRotation][1].y;
            c.x += this._relativeIsoRotationDirections[this._isoRotation][7].x;
            c.y += this._relativeIsoRotationDirections[this._isoRotation][7].y;
            d.x += this._relativeIsoRotationDirections[this._isoRotation][5].x;
            d.y += this._relativeIsoRotationDirections[this._isoRotation][5].y;
            /*         console.log(a, b, c, d);
                    this.highlightCell(a, ctx);
                    this.highlightCell(b, ctx);
                    this.highlightCell(c, ctx);
                    this.highlightCell(d, ctx); */
            // begin cursor in upper left corner of rectangle
            var u = {
                'x': a.x,
                'y': a.y
            };
            var rowStart = {
                'x': a.x,
                'y': a.y
            };
            var rowEnd = {
                'x': b.x + this._relativeIsoRotationDirections[this._isoRotation][0].x,
                'y': b.y + this._relativeIsoRotationDirections[this._isoRotation][0].y
            };
            var terminator = {
                'x': d.x + this._relativeIsoRotationDirections[this._isoRotation][5].x,
                'y': d.y + this._relativeIsoRotationDirections[this._isoRotation][5].y
            };
            var rowCounter = 0;
            while ((u.x != terminator.x) && (u.y != terminator.y)) {
                while ((u.x != rowEnd.x) && (u.y != rowEnd.y)) {
                    if ((u.x > -1) && (u.x < this.map[0].length) && (u.y > -1) && (u.y < this.map.length)) {
                        //this.highlightCell(u, ctx);
                        // draw tiles from ground up
                        var stackingHeight = 0;
                        for (var level = 0; level < this.map[u.y][u.x].length; level++) {
                            // todo: detect if tile is visible or obscured to speed up drawing
                            var tileQ = Math.floor(this.map[u.y][u.x][level] / 4);
                            var tileR = (this._isoRotation + this.map[u.y][u.x][level]) % 4;
                            this.drawIsoTile({
                                'x': u.x + this._relativeIsoRotationDirections[this._isoRotation][2].x * stackingHeight,
                                'y': u.y + this._relativeIsoRotationDirections[this._isoRotation][2].y * stackingHeight
                            }, this.tiles[4 * tileQ + tileR], ctx);
                            stackingHeight += this.tiles[this.map[u.y][u.x][level]].properties.cellHeight;
                        }
                    }
                    // move cursor left
                    u.x += this._relativeIsoRotationDirections[this._isoRotation][0].x;
                    u.y += this._relativeIsoRotationDirections[this._isoRotation][0].y;
                }
                // proceed downward in zigzag fashion
                // /  \
                // \  /
                // /  \
                // ..
                if (rowCounter % 2 == 1) {
                    rowStart.x += this._relativeIsoRotationDirections[this._isoRotation][5].x;
                    rowStart.y += this._relativeIsoRotationDirections[this._isoRotation][5].y;
                    rowEnd.x += this._relativeIsoRotationDirections[this._isoRotation][7].x;
                    rowEnd.y += this._relativeIsoRotationDirections[this._isoRotation][7].y;
                }
                else {
                    rowStart.x += this._relativeIsoRotationDirections[this._isoRotation][7].x;
                    rowStart.y += this._relativeIsoRotationDirections[this._isoRotation][7].y;
                    rowEnd.x += this._relativeIsoRotationDirections[this._isoRotation][5].x;
                    rowEnd.y += this._relativeIsoRotationDirections[this._isoRotation][5].y;
                }
                rowCounter++;
                u = { 'x': rowStart.x, 'y': rowStart.y }; // set cursor to next row
            }
        };
        IsoCanvas.prototype.drawCartesianAxes = function (ctx) {
            var northWest = { "x": 0, "y": 0 };
            var southEast = { "x": this._canvas.width, "y": this._canvas.height };
            northWest = this.canvasToCartesianCoordinates(northWest);
            southEast = this.canvasToCartesianCoordinates(southEast);
            if ((northWest.x <= 0) && (southEast.x >= 0)) {
                var topCoord = { "x": 0, "y": northWest.y };
                var bottomCoord = { "x": 0, "y": southEast.y };
                topCoord = this.cartesianToCanvasCoords(topCoord);
                bottomCoord = this.cartesianToCanvasCoords(bottomCoord);
                ctx.strokeStyle = this.axesColor;
                ctx.beginPath();
                ctx.moveTo(topCoord.x, topCoord.y);
                ctx.lineTo(bottomCoord.x, bottomCoord.y);
                ctx.stroke();
            }
            if ((northWest.y >= 0) && (southEast.y <= 0)) {
                var leftCoord = { "x": northWest.x, "y": 0 };
                var rightCoord = { "x": southEast.x, "y": 0 };
                leftCoord = this.cartesianToCanvasCoords(leftCoord);
                rightCoord = this.cartesianToCanvasCoords(rightCoord);
                ctx.strokeStyle = this.axesColor;
                ctx.beginPath();
                ctx.moveTo(leftCoord.x, leftCoord.y);
                ctx.lineTo(rightCoord.x, rightCoord.y);
                ctx.stroke();
            }
        };
        IsoCanvas.prototype.drawIsoAxes = function (ctx) {
            // find where x and y axis intersect canvas boundaries
            var xAxis = this._cartesianGetLineSegmentInCanvasBounds(this.isoToCartesianCoords({ 'x': 0, 'y': 0 }), this.isoToCartesianCoords({ 'x': 1, 'y': 0 }));
            var yAxis = this._cartesianGetLineSegmentInCanvasBounds(this.isoToCartesianCoords({ 'x': 0, 'y': 0 }), this.isoToCartesianCoords({ 'x': 0, 'y': 1 }));
            ctx.strokeStyle = this.axesColor;
            var u, v;
            if (xAxis) {
                u = this.cartesianToCanvasCoords(xAxis.u);
                v = this.cartesianToCanvasCoords(xAxis.v);
                ctx.beginPath();
                ctx.moveTo(u.x, u.y);
                ctx.lineTo(v.x, v.y);
                ctx.stroke();
            }
            if (yAxis) {
                u = this.cartesianToCanvasCoords(yAxis.u);
                v = this.cartesianToCanvasCoords(yAxis.v);
                ctx.beginPath();
                ctx.moveTo(u.x, u.y);
                ctx.lineTo(v.x, v.y);
                ctx.stroke();
            }
        };
        IsoCanvas.prototype.drawIsoGrid = function (ctx) {
            // get isometric coordinates of canvas boundary corners
            // a----b
            // |    |
            // d----c
            var a = this.canvasToIsoCoords({ "x": 0, "y": 0 });
            var b = this.canvasToIsoCoords({ 'x': this._canvas.width, 'y': 0 });
            var c = this.canvasToIsoCoords({ "x": this._canvas.width, "y": this._canvas.height });
            var d = this.canvasToIsoCoords({ 'x': 0, 'y': this._canvas.height });
            a.x = Math.floor(a.x);
            a.y = Math.floor(a.y);
            c.x = Math.floor(c.x) + 1;
            c.y = Math.floor(c.y) + 1;
            b.x = Math.floor(b.x) + 1;
            b.y = Math.floor(b.y);
            d.x = Math.floor(d.x);
            d.y = Math.floor(d.y) + 1;
            ctx.strokeStyle = this.gridColor;
            var uv, u, v;
            var minX = Math.min(a.x, b.x, c.x, d.x);
            var maxX = Math.max(a.x, b.x, c.x, d.x);
            var minY = Math.min(a.y, b.y, c.y, d.y);
            var maxY = Math.max(a.y, b.y, c.y, d.y);
            // plot x gridlines
            for (var x = minX; x < maxX; x++) {
                uv = this._cartesianGetLineSegmentInCanvasBounds(this.isoToCartesianCoords({ 'x': x, 'y': 0 }), this.isoToCartesianCoords({ 'x': x, 'y': 1 }));
                if (uv) {
                    u = this.cartesianToCanvasCoords(uv.u);
                    v = this.cartesianToCanvasCoords(uv.v);
                    ctx.beginPath();
                    ctx.moveTo(u.x, u.y);
                    ctx.lineTo(v.x, v.y);
                    ctx.stroke();
                }
            }
            // plot y gridlines
            for (var y = minY; y < maxY; y++) {
                uv = this._cartesianGetLineSegmentInCanvasBounds(this.isoToCartesianCoords({ 'x': 0, 'y': y }), this.isoToCartesianCoords({ 'x': 1, 'y': y }));
                if (uv) {
                    u = this.cartesianToCanvasCoords(uv.u);
                    v = this.cartesianToCanvasCoords(uv.v);
                    ctx.beginPath();
                    ctx.moveTo(u.x, u.y);
                    ctx.lineTo(v.x, v.y);
                    ctx.stroke();
                }
            }
        };
        IsoCanvas.prototype.paint = function () {
            var ctx = this._canvas.getContext('2d');
            this.clearCanvas(ctx);
            if (this.showGrid) {
                this.drawIsoGrid(ctx);
            }
            if (this.showAxes) {
                this.drawIsoAxes(ctx);
            }
            this.drawIsoTilesWithinCanvasFrame(ctx);
            this.highlightCell(this._mouseCell, ctx);
        };
        // map methods
        IsoCanvas.prototype.generateRandomMap = function (width, length, maxHeight) {
            var map = [];
            var height = 0;
            for (var y = 0; y < length; y++) {
                map.push([]);
                for (var x = 0; x < width; x++) {
                    map[y].push([]);
                    height = 1 + Math.floor(Math.random() * maxHeight);
                    for (var h = 0; h < height; h++) {
                        map[y][x].push(Math.floor(Math.random() * this.tiles.length));
                        if (this.tiles[map[y][x][h]].properties.canStack == false) {
                            break;
                        }
                    }
                }
            }
            this.map = map;
        };
        IsoCanvas.prototype.saveMap = function (filename) {
            var tilesrc = [];
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                tilesrc.push(tile.image.src);
            }
            var mapDimensions = { 'x': 0, 'y': 0 };
            if (this.map) {
                mapDimensions.y = this.map.length;
                if (this.map[0]) {
                    mapDimensions.x = this.map[0].length;
                }
            }
            var file = new Blob([JSON.stringify({
                    'mapDimensions': mapDimensions,
                    'tileset': tilesrc,
                    'map': this.map
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
        IsoCanvas.prototype.loadMap = function () {
            var _this = this;
            var inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'file');
            inputElement.setAttribute('style', 'display:none');
            inputElement.addEventListener('change', function (ev) {
                var fileList = ev.target.files;
                if (fileList.length > 0) {
                    var reader_1 = new FileReader();
                    reader_1.onload = (function (e) {
                        try {
                            var mapDataJSON_1 = JSON.parse(reader_1.result.toString());
                            // heavy duty file validation
                            if (('mapDimensions' in mapDataJSON_1) && ('tileset' in mapDataJSON_1) && ('map' in mapDataJSON_1)) {
                                if (('x' in mapDataJSON_1.mapDimensions) && ('y' in mapDataJSON_1.mapDimensions)) {
                                    if ((mapDataJSON_1.map instanceof Array) &&
                                        (typeof mapDataJSON_1.mapDimensions.x == 'number') &&
                                        (typeof mapDataJSON_1.mapDimensions.y == 'number') &&
                                        (mapDataJSON_1.tileset instanceof Array)) {
                                        isoTile.IsoTile.loadTileset(mapDataJSON_1.tileset, function (tileset) {
                                            _this.tiles = tileset;
                                            _this.map = mapDataJSON_1.map;
                                            _this.paint();
                                        });
                                    }
                                    else {
                                        alert('a Invalid isomap file: ' + fileList[0].name);
                                    }
                                }
                                else {
                                    alert('b Invalid isomap file: ' + fileList[0].name);
                                }
                            }
                            else {
                                alert('c Invalid isomap file: ' + fileList[0].name);
                            }
                        }
                        catch (_a) {
                            alert('d Could not parse file: ' + fileList[0].name);
                        }
                    });
                    reader_1.readAsText(fileList[0]);
                }
            }, false);
            document.body.appendChild(inputElement);
            inputElement.click();
            setTimeout(function () {
                document.body.removeChild(inputElement);
            }, 0);
        };
        // Event Listeners
        IsoCanvas.prototype.defaultMouseMoveListener = function (event) {
            var centerDivRect = this._div.getBoundingClientRect();
            this._mouseCanvas = { "x": event.clientX - centerDivRect.left, "y": event.clientY - centerDivRect.top };
            this._mouseCartesian = this.canvasToCartesianCoordinates(this._mouseCanvas);
            this._mouseIso = this.cartesianToIsoCoords(this._mouseCartesian);
            if ((this._mouseCell.x != Math.floor(this._mouseIso.x)) || (this._mouseCell.y != Math.floor(this._mouseIso.y))) {
                this._mouseCell.x = Math.floor(this._mouseIso.x);
                this._mouseCell.y = Math.floor(this._mouseIso.y);
                this.paint();
            }
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
            var size1 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': this._relativeIsoRotationDirections[this._isoRotation][5].x,
                'y': this._relativeIsoRotationDirections[this._isoRotation][5].y
            }));
            var size2 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': this._relativeIsoRotationDirections[this._isoRotation][7].x,
                'y': this._relativeIsoRotationDirections[this._isoRotation][7].y
            }));
            var size3 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': 0,
                'y': 0
            }));
            var size4 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({
                'x': this._relativeIsoRotationDirections[this._isoRotation][6].x,
                'y': this._relativeIsoRotationDirections[this._isoRotation][6].y
            }));
            this._canvasTileSize.x = size2.x - size1.x;
            this._canvasTileSize.y = size4.y - size3.y;
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
        // helper methods
        IsoCanvas.prototype._cartesianGetLineSegmentInCanvasBounds = function (u, v) {
            // get screen boundary corners
            // a----b
            // |    |
            // d----c
            var a = this.canvasToCartesianCoordinates({ "x": 0, "y": 0 });
            var b = this.canvasToCartesianCoordinates({ 'x': this._canvas.width, 'y': 0 });
            var c = this.canvasToCartesianCoordinates({ "x": this._canvas.width, "y": this._canvas.height });
            var d = this.canvasToCartesianCoordinates({ 'x': 0, 'y': this._canvas.height });
            // find where screen boundaries and line uv intersect
            var intersections = [];
            intersections.push({
                'u': a,
                'v': b,
                't': IsoCanvas._findParametricIntersection(a, b, u, v)
            });
            intersections.push({
                'u': b,
                'v': c,
                't': IsoCanvas._findParametricIntersection(b, c, u, v)
            });
            intersections.push({
                'u': c,
                'v': d,
                't': IsoCanvas._findParametricIntersection(c, d, u, v)
            });
            intersections.push({
                'u': d,
                'v': a,
                't': IsoCanvas._findParametricIntersection(d, a, u, v)
            });
            // ignore intersections that occur off screen and non-intersections
            for (var i = 3; i > -1; i--) {
                if (intersections[i].t) {
                    if (intersections[i].t < 0 || intersections[i].t > 1.0) {
                        intersections.splice(i, 1);
                    }
                }
                else {
                    intersections.splice(i, 1);
                }
            }
            // return line segment intersecting screen bounds, if any.
            // !!might break if a line intersects in a screen corner??
            if (intersections.length >= 2) {
                var x1 = IsoCanvas._getParametricPoint(intersections[0].u, intersections[0].v, intersections[0].t);
                var x2 = IsoCanvas._getParametricPoint(intersections[1].u, intersections[1].v, intersections[1].t);
                return { 'u': x1, 'v': x2 };
            }
            else {
                return null;
            }
        };
        IsoCanvas._findParametricIntersection = function (A1, A2, B1, B2) {
            var a = { 'x': A2.x - A1.x, 'y': A2.y - A1.y };
            var b = { 'x': B2.x - B1.x, 'y': B2.y - B1.y };
            var c = { 'x': B1.x - A1.x, 'y': B1.y - A1.y };
            var determinant = b.x * a.y - a.x * b.y;
            if (determinant != 0) {
                return (b.x * c.y - c.x * b.y) / determinant;
            }
            else {
                return null;
            }
        };
        IsoCanvas._getParametricPoint = function (u, v, t) {
            return { 'x': u.x + t * (v.x - u.x), 'y': u.y + t * (v.y - u.y) };
        };
        return IsoCanvas;
    }());
    exports.IsoCanvas = IsoCanvas;
});
