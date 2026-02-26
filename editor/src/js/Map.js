class Map {
    constructor(ctxID, tileSize){
        this.tileSize = tileSize;
        this.handle = null;
        this.ctx = null;

        this.data = {
            tiles: [[],[]],
            collision: []
        }
        this.map = {
            tilesetUsed: null,
            tilesetImgUsed: null,
            widthInTiles: -1,
            heightInTiles: -1
        };

        this.hover = {
            x: -1,
            y: -1,
        }

        this.options = new Options;
        this.mousedrag = false;

        this.init(ctxID);
    }

    init(id){
        const tempHandle = document.getElementById(id);
        if(!tempHandle){
            console.log(`couldn't find element of id: ${id}`);
            return;
        }
        this.handle = tempHandle;
        this.ctx = tempHandle.getContext('2d');
        
        this.handle.addEventListener('mousedown', e => {
            this.mousedrag = true;
        });
        this.handle.addEventListener('mouseup', e => {
            this.mousedrag = false;
        });
        this.handle.addEventListener('mouseleave', e => {
            this.mousedrag = false;
        });
        this.handle.addEventListener('mousemove', e => {
            this.updateSelection(e);
            if(this.mousedrag && this.options.tools.active == 'Brush') this.placeTile();
        });
        this.handle.addEventListener('click', e => {
            this.placeTile();
        });
    }

    initTiles(){
        for(let layer = 0; layer < 2; layer++){
            for(let rowNum = 0; rowNum < this.map.heightInTiles; rowNum++){
                const newTilesRow = [];
                const newCollisionRow = [];
                for(let tileNum = 0; tileNum < this.map.widthInTiles; tileNum++){
                    newTilesRow.push([-1, -1]);
                    if(layer == 0) newCollisionRow.push(false);
                }
                this.data.tiles[layer].push(newTilesRow);
                if(layer == 0) this.data.collision.push(newCollisionRow);
            }
            console.log(this.data.tiles[layer]);
        }
        
    }

    resizeTiles(){
        const newTiles = [];
        const newCollision = [];
        for(let layer = 0; layer < 2; layer++){
            const newLayer = [];
            for(let rowNum = 0; rowNum < this.map.heightInTiles; rowNum++){
                const newTilesRow = [];
                const newCollisionRow = [];
                for(let tileNum = 0; tileNum < this.map.widthInTiles; tileNum++){
                    const targetTile = this.data.tiles[layer][rowNum]?.[tileNum] || [-1,-1];
                    newTilesRow.push([targetTile[0], targetTile[1]]);
                    if(layer == 0){
                        const targetCollision = this.data.collision[rowNum]?.[tileNum] || false;
                        newCollisionRow.push(targetCollision);
                    }
                }
                newLayer.push(newTilesRow);
                if(layer == 0) newCollision.push(newCollisionRow);
            }
            newTiles.push(newLayer);
        }
        
        this.data.tiles = newTiles;
        console.log(this.data.tiles)
        this.data.collision = newCollision;
    }

    placeTile(){
        if(this.map.tilesetUsed){
            const targetRow = Math.round(this.hover.y / this.tileSize);
            const targetTile = Math.round(this.hover.x / this.tileSize);
            console.log(this.options.tools.active == 'Collision')
            if(this.options.tools.active == 'Collision'){
                const currentCollision = this.data.collision[targetRow][targetTile];
                this.data.collision[targetRow][targetTile] = !currentCollision;
                return;
            }

            const tilesetPos = this.options.tools.active == 'Erase' 
                ? { x: -1, y: -1 } : this.map.tilesetUsed.getSelectedPos();
                
            this.data.tiles[this.options.layers.active][targetRow][targetTile][0] = Math.floor(tilesetPos.x / this.tileSize);
            this.data.tiles[this.options.layers.active][targetRow][targetTile][1] = Math.floor(tilesetPos.y / this.tileSize);
        }
    }

    updateSelection(e){
        const pos = this.getGridPos(e);
        if(pos.x >= this.map.widthInTiles * this.tileSize || pos.y >= this.map.heightInTiles * this.tileSize) return;
        this.hover.x = pos.x;
        this.hover.y = pos.y;
    }

    exportMap(){
        return {
            tiles: this.data.tiles,
            collision: this.data.collision
        };
    }

    setSize(widthInTiles, heightInTiles){
        if(widthInTiles < 10 || heightInTiles < 10){
            console.log('Map cannot be smaller than 10x10');
            return;
        }
        if(widthInTiles > 100 || heightInTiles > 100){
            console.log('Map cannot be bigger than 100x100');
            return;
        }
        if(!this.ctx || !this.handle){
            console.log('Could not set size of the map, ctx or handle is null');
            return;
        }
        this.handle.width = widthInTiles * this.tileSize;
        this.handle.height = heightInTiles * this.tileSize;
        this.map.widthInTiles = widthInTiles;
        this.map.heightInTiles = heightInTiles;
        console.log(`Map size set to ${this.handle.width}x${this.handle.height}`);

        if(!this.data.tiles[0].length || !this.data.tiles[1].length){
            console.log('init tiles')
            this.initTiles();
        }
        else{
            this.resizeTiles();
        }
    }

    setTilesetImg(img){
        this.map.tilesetImgUsed = img;
    }

    setTileset(tileset){
        this.map.tilesetUsed = tileset;
    }

    getGridPos(e){
        const x = Math.floor(e.offsetX / this.tileSize) * this.tileSize;
        const y = Math.floor(e.offsetY / this.tileSize) * this.tileSize;
        return { x, y };
    }

    draw(){
        if(!this.map.tilesetImgUsed) return;
        this.ctx.clearRect(0,0,this.handle.width,this.handle.height);
        this.drawLayer(0);
        if(this.options.layers.active == 1){
            this.drawMapShade('rgba(50,50,50,0.5)');
        }
        this.drawLayer(1);
        if(this.options.tools.active == 'Collision'){
            this.drawMapShade('rgba(50,50,50,0.25)');
        }
        this.drawSelection(this.hover, 'black', 2  );
    }

    drawLayer(layer){
        for(let rowNum = 0; rowNum < this.map.heightInTiles; rowNum++){
            for(let tileNum = 0; tileNum < this.map.widthInTiles; tileNum++){
                const targetX = this.data.tiles[layer][rowNum][tileNum][0];
                const targetY = this.data.tiles[layer][rowNum][tileNum][1];
                if(targetX >= 0 || targetY >= 0){
                    this.drawTile(targetX, targetY, tileNum, rowNum);
                }
                if(layer == 1 && this.options.tools.active == 'Collision'){
                    const collision = this.data.collision[rowNum][tileNum];
                    if(collision){
                        this.drawCollision(tileNum * this.tileSize, rowNum * this.tileSize, 'black', 2);
                    }
                }
            }
        }
    }

    drawTile(targetX, targetY, tileNum, rowNum){
        this.ctx.drawImage(
            this.map.tilesetImgUsed,
            targetX * this.tileSize, targetY * this.tileSize,
            this.tileSize, this.tileSize,
            tileNum * this.tileSize, rowNum * this.tileSize,
            this.tileSize, this.tileSize
        );
    }

    drawSelection(rect, color, lineWidth){
        if(rect.x < 0 || rect.y < 0) return;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(rect.x, rect.y, this.tileSize, this.tileSize);
    }

    drawCollision(x, y, color, lineWidth){
        this.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + this.tileSize, y + this.tileSize);
        this.ctx.moveTo(x + this.tileSize, y);
        this.ctx.lineTo(x, y + this.tileSize);
        this.ctx.stroke();
    }

    drawMapShade(color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0,0,this.handle.width, this.handle.height);
        this.ctx.fillStyle = 'black';
    }

}