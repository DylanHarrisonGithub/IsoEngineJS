class IsoCanvas {

    private _div: HTMLDivElement;
    private _canvas: HTMLCanvasElement;
    private _location = {'x': 0, 'y': 0};
    private _tileSize = {'x': 64, 'y': 32};
    private _doubleTileSizeInverse = {'x': 1.0 /(2*64), 'y': 1.0 /(2*32)};   
    private _canvasTileSize = {'x': 64, 'y': 32};
    private _zoom =  1.0;
    private _zoomInverse = 1.0;
    private _halfResolution = {'x': 0, 'y': 0};
    private _mouseCanvas = {'x': 0, 'y': 0};
    private _mouseCartesian = {'x': 0, 'y': 0};
    private _mouseIso = {'x': 0, 'y': 0};
    
    public axesColor = '#000000';
    public gridColor = '#A0A0C0';
    public backgroundColor = '#ffffff';
    public layers = [];
    public tiles = [];
    public showAxes = true;
    public showGrid = true;

    constructor(delagateDiv: HTMLDivElement) {

        this._div = delagateDiv;
        this._canvas = document.createElement('canvas');
        this._div.append(this._canvas);
        this._canvas.width = this._div.clientWidth;
        this._canvas.height = this._div.clientHeight;
        this._halfResolution.x = this._canvas.width / 2;
        this._halfResolution.y = this._canvas.height / 2;

        var size1 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 0, 'y': 1}));
        var size2 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 1, 'y': 0}));
        var size3 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 0, 'y': 0}));
        var size4 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 1, 'y': 1}));
        this._canvasTileSize.x = size2.x - size1.x;
        this._canvasTileSize.y = size4.y - size3.y;

        this._div.addEventListener('mousemove', (ev: UIEvent) => {this.defaultMouseMoveListener(ev)});

        window.addEventListener('resize', (ev: UIEvent) => {
            this._canvas.width = this._div.clientWidth;
            this._canvas.height = this._div.clientHeight;        
            this._halfResolution.x = this._canvas.width / 2;
            this._halfResolution.y = this._canvas.height / 2;
        });

    }

    // Transformations
    isoToCartesianCoords(isoCoord: {'x': number, 'y': number}) {
        return {
            'x': this._tileSize.x*(isoCoord.x - isoCoord.y),
            'y': -this._tileSize.y*(isoCoord.x + isoCoord.y)
        };
    }

    cartesianToIsoCoords(cartesianCoord:  {'x': number, 'y': number}) {
        return {
            'x': cartesianCoord.x*this._doubleTileSizeInverse.x - cartesianCoord.y*this._doubleTileSizeInverse.y,
            'y': -(cartesianCoord.x*this._doubleTileSizeInverse.x + cartesianCoord.y*this._doubleTileSizeInverse.y)
        };
    }

    cartesianToCanvasCoords(cartesianCoord: {'x': number, 'y': number}) {
        return {
            'x': (cartesianCoord.x - this._location.x)*this._zoom + this._canvas.width / 2,
            'y': -(cartesianCoord.y - this._location.y)*this._zoom + this._canvas.height / 2
        };
    }

    canvasToCartesianCoordinates(screenCoordinate: {'x': number, 'y': number}) {
        return {
            'x': (screenCoordinate.x - this._halfResolution.x)*this._zoomInverse + this._location.x,
            'y': -(screenCoordinate.y - this._halfResolution.y)*this._zoomInverse + this._location.y
        }
    };

    isoToCanvasCoords(isoCoord: {'x': number, 'y': number}) {
        return this.cartesianToCanvasCoords(
            this.isoToCartesianCoords(isoCoord)
        );
    }

    canvasToIsoCoords(canvasCoord: {'x': number, 'y': number}) {
        return this.cartesianToIsoCoords(
            this.canvasToCartesianCoordinates(canvasCoord)
        );
    }

    // Drawing
    clearCanvas(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0,0,this._canvas.width,this._canvas.height);
    }

    drawIsoTile(isoCoord:  {'x': number, 'y': number}, img: HTMLImageElement, ctx: CanvasRenderingContext2D) {

        var pX = this.isoToCanvasCoords({'x': isoCoord.x -.5, 'y': isoCoord.y +.5});

        ctx.drawImage(img, pX.x, pX.y, this._canvasTileSize.x, this._canvasTileSize.y);
    }

    drawIsoTilesWithinCanvasFrame(ctx: CanvasRenderingContext2D) {

        // get isometric coordinates of canvas boundary corners
        // a----b
        // |    |
        // d----c
        var a = this.canvasToIsoCoords({"x": 0, "y": 0});
        var b = this.canvasToIsoCoords({'x': this._canvas.width, 'y': 0});
        var c = this.canvasToIsoCoords({"x": this._canvas.width, "y": this._canvas.height});
        var d = this.canvasToIsoCoords({'x': 0, 'y': this._canvas.height});

        // make sure corners form a perfect box
        a.x = Math.floor(a.x) - 1;
        a.y = Math.floor(a.y);
        b.x = Math.floor(b.x);
        b.y = a.y - b.x + a.x;     
        c.y = Math.floor(c.y);
        c.x = c.y - b.y + b.x;
        d.x = ((c.x+c.y)+(a.x-a.y))/2;
        d.y = ((c.x+c.y)-(a.x-a.y))/2;

        var u = {'x': a.x, 'y': a.y};
        var height = 2*(d.y - a.y) + 1;
        for (var diagonal = 0; diagonal < height; diagonal++) {

            while ((u.x <= b.x) && (u.y >= b.y)) {

                if ((u.x > -1) && (u.x < this.layers[0][0].length) && (u.y > -1) && (u.y < this.layers[0].length)) {    
                    this.drawIsoTile({'x': u.x, 'y': u.y}, this.tiles[this.layers[0][u.y][u.x]], ctx);
                }
                u.x++;
                u.y--;
            }
            if (diagonal % 2 == 1) {
                b.y++;
                a.x++;
            } else {
                b.x++;
                a.y++;
            }
            u = {'x': a.x, 'y': a.y};
        }
    }

    drawAxes(ctx: CanvasRenderingContext2D) {

        var northWest = {"x":0, "y":0};
        var southEast = {"x": this._canvas.width, "y": this._canvas.height};
        northWest = this.canvasToCartesianCoordinates(northWest);
        southEast = this.canvasToCartesianCoordinates(southEast);

        if ((northWest.x <= 0) && (southEast.x >= 0)) {
            
            var topCoord = {"x":0, "y":northWest.y};
            var bottomCoord = {"x":0,"y":southEast.y};
            
            topCoord = this.cartesianToCanvasCoords(topCoord);
            bottomCoord = this.cartesianToCanvasCoords(bottomCoord);

            ctx.strokeStyle = this.axesColor;
            ctx.beginPath();
            ctx.moveTo(topCoord.x, topCoord.y);
            ctx.lineTo(bottomCoord.x, bottomCoord.y);
            ctx.stroke();
            
        }
        if ((northWest.y >= 0) && (southEast.y <= 0)) {
            
            var leftCoord = {"x":northWest.x, "y":0};
            var rightCoord = {"x":southEast.x, "y":0};

            leftCoord = this.cartesianToCanvasCoords(leftCoord);
            rightCoord = this.cartesianToCanvasCoords(rightCoord);

            ctx.strokeStyle = this.axesColor;
            ctx.beginPath();
            ctx.moveTo(leftCoord.x, leftCoord.y);
            ctx.lineTo(rightCoord.x, rightCoord.y);
            ctx.stroke();
            
        }		
    }

    drawIsoAxes(ctx: CanvasRenderingContext2D) {

        // find where x and y axis intersect canvas boundaries
        var xAxis = this._cartesianGetLineSegmentInCanvasBounds(
            this.isoToCartesianCoords({'x': 0, 'y': 0}),
            this.isoToCartesianCoords({'x': 1, 'y': 0})
        );

        var yAxis = this._cartesianGetLineSegmentInCanvasBounds(
            this.isoToCartesianCoords({'x': 0, 'y': 0}),
            this.isoToCartesianCoords({'x': 0, 'y': 1})
        );
        
        ctx.strokeStyle = this.axesColor;
        var u, v;
        if (xAxis) {

            u = this.cartesianToCanvasCoords(xAxis.u);
            v = this.cartesianToCanvasCoords(xAxis.v);

            ctx.beginPath();
            ctx.moveTo(u.x , u.y);
            ctx.lineTo(v.x, v.y);
            ctx.stroke();
        }

        if (yAxis) {

            u = this.cartesianToCanvasCoords(yAxis.u);
            v = this.cartesianToCanvasCoords(yAxis.v);

            ctx.beginPath();
            ctx.moveTo(u.x , u.y);
            ctx.lineTo(v.x, v.y);
            ctx.stroke();
        }
        
    }

    drawIsoGrid(ctx: CanvasRenderingContext2D) {

        // get isometric coordinates of canvas boundary corners
        // a----b
        // |    |
        // d----c
        var a = this.canvasToIsoCoords({"x": 0, "y": 0});
        var b = this.canvasToIsoCoords({'x': this._canvas.width, 'y': 0});
        var c = this.canvasToIsoCoords({"x": this._canvas.width, "y": this._canvas.height});
        var d = this.canvasToIsoCoords({'x': 0, 'y': this._canvas.height});

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

        // plot x gridlines
        for (var x = a.x; x < c.x; x++) {

            uv = this._cartesianGetLineSegmentInCanvasBounds(
                this.isoToCartesianCoords({'x': x, 'y': 0}),
                this.isoToCartesianCoords({'x': x, 'y': 1})
            );

            if (uv) {
                u = this.cartesianToCanvasCoords(uv.u);
                v = this.cartesianToCanvasCoords(uv.v);
                ctx.beginPath();
                ctx.moveTo(u.x , u.y);
                ctx.lineTo(v.x, v.y);
                ctx.stroke();
            }
        }

        // plot y gridlines
        for (var y = b.y; y < d.y; y++) {

            uv = this._cartesianGetLineSegmentInCanvasBounds(
                this.isoToCartesianCoords({'x': 0, 'y': y}),
                this.isoToCartesianCoords({'x': 1, 'y': y})
            );

            if (uv) {
                u = this.cartesianToCanvasCoords(uv.u);
                v = this.cartesianToCanvasCoords(uv.v);
                ctx.beginPath();
                ctx.moveTo(u.x , u.y);
                ctx.lineTo(v.x, v.y);
                ctx.stroke();
            }
        }
    }
    
    paint() {

        var ctx = this._canvas.getContext('2d');
        this.clearCanvas(ctx);

        // draw tilemap
/*         for (var l = 0; l < this.layers.length; l++) {
            for (var y = 0; y < this.layers[l].length; y++) {
                for (var x = 0; x < this.layers[l][y].length; x++) {
                    this.drawIsoTile({'x': x, 'y': y}, this.tiles[this.layers[l][y][x]], ctx);
                }
            }                      
        } */
        this.drawIsoTilesWithinCanvasFrame(ctx);

        if (this.showGrid) {
            this.drawIsoGrid(ctx);
        }

        if (this.showAxes) {
            this.drawIsoAxes(ctx);
            //this.drawAxes();
        }
    }

    // Event Listeners
    defaultMouseMoveListener(event) {
        
        var centerDivRect = this._div.getBoundingClientRect();
        this._mouseCanvas = {"x": event.clientX-centerDivRect.left, "y": event.clientY-centerDivRect.top};
        this._mouseCartesian = this.canvasToCartesianCoordinates(this._mouseCanvas);
        this._mouseIso = this.cartesianToIsoCoords(this._mouseCartesian);
        
    }
    
    defaultMouseWheelListener(event) {
        
        if (event.deltaY < 0) {
            this._zoom = this._zoom*(1.05);
            this._zoomInverse = 1.0/this._zoom;
        } else {
            this._zoom = this._zoom*(0.95);
            this._zoomInverse = 1.0/this._zoom;			
        }
        
        var size1 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 0, 'y': 1}));
        var size2 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 1, 'y': 0}));
        var size3 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 0, 'y': 0}));
        var size4 = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': 1, 'y': 1}));
        this._canvasTileSize.x = size2.x - size1.x;
        this._canvasTileSize.y = size4.y - size3.y;
        
    }
    
    defaultMouseClickListener(event) {
        
        var centerDivRect = this._div.getBoundingClientRect();
        this._mouseCanvas = {"x": event.clientX-centerDivRect.left, "y": event.clientY-centerDivRect.top};
        this._mouseCartesian = this.canvasToCartesianCoordinates(this._mouseCanvas);

        this._location.x = this._mouseCartesian.x;
        this._location.y = this._mouseCartesian.y;
        
        //this._mouseCanvas = {"x": this._halfResolution.x, "y": this._halfResolution.y};
        //this._mouseCartesian = {"x": 0, "y": 0};

    }
    
    // helper methods
    _cartesianGetLineSegmentInCanvasBounds(
        u: {'x': number, 'y': number},
        v: {'x': number, 'y': number}
    ) {

        // get screen boundary corners
        // a----b
        // |    |
        // d----c
        var a = this.canvasToCartesianCoordinates({"x": 0, "y": 0});
        var b = this.canvasToCartesianCoordinates({'x': this._canvas.width, 'y': 0});
        var c = this.canvasToCartesianCoordinates({"x": this._canvas.width, "y": this._canvas.height});
        var d = this.canvasToCartesianCoordinates({'x': 0, 'y': this._canvas.height});

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
            } else {
                intersections.splice(i, 1);
            }
        }

        // return line segment intersecting screen bounds, if any.
        // !!might break if a line intersects in a screen corner??
        if (intersections.length >= 2) {

            var x1 = IsoCanvas._getParametricPoint(
                intersections[0].u,
                intersections[0].v,
                intersections[0].t);

            var x2 = IsoCanvas._getParametricPoint(
                intersections[1].u,
                intersections[1].v,
                intersections[1].t);

            return {'u': x1, 'v': x2};

        } else {
            return null;
        }

    }
    static _findParametricIntersection(
        A1: {'x': number, 'y': number},
        A2: {'x': number, 'y': number},
        B1: {'x': number, 'y': number},
        B2: {'x': number, 'y': number}
    ) {
        var a = {'x': A2.x - A1.x, 'y': A2.y - A1.y};
        var b = {'x': B2.x - B1.x, 'y': B2.y - B1.y};
        var c = {'x': B1.x - A1.x, 'y': B1.y - A1.y};

        var determinant = b.x*a.y - a.x*b.y;

        if (determinant != 0) {
            return (b.x*c.y - c.x*b.y) / determinant;
        } else {
            return null;
        }
    }

    static _getParametricPoint(
        u: {'x': number, 'y': number},
        v: {'x': number, 'y': number},
        t: number
    ) {
        return {'x': u.x + t*(v.x - u.x), 'y': u.y + t*(v.y - u.y)};
    }

}
