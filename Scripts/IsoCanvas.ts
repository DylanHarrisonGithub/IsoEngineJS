class IsoCanvas {

    private _div: HTMLDivElement;
    private _canvas: HTMLCanvasElement;
    private _location = {'x': 0, 'y': 0};
    private _tileSize = {'x': 64, 'y': 32};
    private _zoom =  1.0;
    private _zoomInverse = 1.0;

    constructor(delagateDiv: HTMLDivElement) {

        this._div = delagateDiv;
        this._canvas = document.createElement('canvas');
        this._div.append(this._canvas);
        this._canvas.width = this._div.clientWidth;
        this._canvas.height = this._div.clientHeight;

        window.addEventListener('resize', (ev: UIEvent) => {
            this._canvas.width = this._div.clientWidth;
            this._canvas.height = this._div.clientHeight;
        });

    }

    isoToCartesianCoords(isoCoord: {'x': number, 'y': number}) {
        var cartesianCoord = {
            'x': this._tileSize.x*(isoCoord.x - isoCoord.y),
            'y': this._tileSize.y*(isoCoord.x + isoCoord.y)
        };
        return cartesianCoord;
    }

    cartesianToCanvasCoords(cartesianCoord: {'x': number, 'y': number}) {
        var canvasCoord = {
            'x': cartesianCoord.x + this._canvas.width / 2,
            'y': cartesianCoord.y + this._canvas.height / 6
        };
        return canvasCoord;
    }

    isoToCanvasCoords(isoCoord: {'x': number, 'y': number}) {
        return this.cartesianToCanvasCoords(
            this.isoToCartesianCoords(isoCoord)
        );
    }

    drawIsoTile(isoCoord:  {'x': number, 'y': number}, img: HTMLImageElement) {

        var ctx = this._canvas.getContext('2d');
        var pX = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': isoCoord.x, 'y': isoCoord.y+1}));
        var pY = this.cartesianToCanvasCoords(this.isoToCartesianCoords({'x': isoCoord.x, 'y': isoCoord.y}));
        var sizeX = this.isoToCartesianCoords({'x': 2, 'y': 0});
        var sizeY = this.isoToCartesianCoords({'x': 1, 'y': 1});

        ctx.drawImage(img, pX.x, pY.y, sizeX.x, sizeY.y);
    }

}
