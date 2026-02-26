class Map {
    constructor(ctxID, tileSize){
        this.tileSize = tileSize;
        this.handle = null;
        this.ctx = null;

        this.tiles = [];
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
        for(let rowNum = 0; rowNum < this.map.heightInTiles; rowNum++){
            const newRow = [];
            for(let tileNum = 0; tileNum < this.map.widthInTiles; tileNum++){
                newRow.push([-1, -1, false]);
            }
            this.tiles.push(newRow);
        }
        console.log(this.tiles);
    }

    resizeTiles(){
        const newTiles = [];
        for(let rowNum = 0; rowNum < this.map.heightInTiles; rowNum++){
            const newRow = [];
            for(let tileNum = 0; tileNum < this.map.widthInTiles; tileNum++){
                const targetTile = this.tiles[rowNum]?.[tileNum] || [-1,-1, false];
                newRow.push([targetTile[0], targetTile[1]]);
            }
            newTiles.push(newRow);
        }
        this.tiles = newTiles;
    }

    placeTile(){
        if(this.map.tilesetUsed){
            const targetRow = Math.round(this.hover.y / this.tileSize);
            const targetTile = Math.round(this.hover.x / this.tileSize);
            console.log(this.options.tools.active == 'Collision')
            if(this.options.tools.active == 'Collision'){
                const currentCollision = this.tiles[targetRow][targetTile][2];
                this.tiles[targetRow][targetTile][2] = !currentCollision;
                return;
            }

            const tilesetPos = this.options.tools.active == 'Erase' 
                ? { x: -1, y: -1 } : this.map.tilesetUsed.getSelectedPos();
                
            this.tiles[targetRow][targetTile][0] = Math.floor(tilesetPos.x / this.tileSize);
            this.tiles[targetRow][targetTile][1] = Math.floor(tilesetPos.y / this.tileSize);
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
            name: 'map name',
            tiles: this.tiles
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

        if(!this.tiles.length){
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
        for(let rowNum = 0; rowNum < this.map.heightInTiles; rowNum++){
            for(let tileNum = 0; tileNum < this.map.widthInTiles; tileNum++){
                const targetX = this.tiles[rowNum][tileNum][0];
                const targetY = this.tiles[rowNum][tileNum][1];
                if(targetX >= 0 || targetY >= 0){
                    this.drawTile(targetX, targetY, tileNum, rowNum);
                }
                if(this.options.tools.active == 'Collision'){
                    const collision = this.tiles[rowNum][tileNum][2];
                    if(collision){
                        this.drawCollision(tileNum * this.tileSize, rowNum * this.tileSize, 'black', 2);
                    }
                }
            }
        }
        if(this.options.tools.active == 'Collision'){
            this.ctx.fillStyle = 'rgba(50,50,50,0.25)';
            this.ctx.fillRect(0,0,this.handle.width, this.handle.height);
            this.ctx.fillStyle = 'black';
        }
        this.drawSelection(this.hover, 'black', 2  );
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

}