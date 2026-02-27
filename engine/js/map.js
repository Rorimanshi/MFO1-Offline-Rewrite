class Map{
    constructor(player){
        this.player = player;
        this.data = {
            tiles: [],
            collision: []
        };
        this.img = null;
    }

    async load(src){
        try{
            this.busy = true;
            const res = await fetch(src);
            const mapData = await res.json();
            this.data.tiles = mapData.tiles;
            console.log(`${src} loaded`);
            this.loaded = true;
            this.busy = false;
        } catch(err){
            console.log('Failed to load map: ', err);
            this.busy = false;
        }
    }
    loadMap(mapFile){
        const mapInfo = JSON.parse(mapFile);
        this.data.tiles = mapInfo.tiles;
    }
    draw(ctx){
        const cameraCenter = this.player.getPosTile();
        let rowStart = cameraCenter.y - 3;
        let columnStart = cameraCenter.x -3;
        const rowEnd = rowStart + 7;
        const columnEnd = columnStart + 7;
        for(let layer = 0; layer < 2; layer++){
            for(let row = rowStart; row < rowEnd; row++){
                for(let tile = columnStart; tile < columnEnd; tile++){
                    if(this.img.complete && this.img.naturalHeight > 0){
                        const tileData = this.data.tiles[layer][row]?.[tile];
                        if (!tileData) continue;
                        const [targetTileX, targetTileY] = tileData;
                        ctx.drawImage(
                            this.img,
                            targetTileX * 32, targetTileY * 32,  // source position
                            TILE_WIDTH, TILE_HEIGHT,  // source size
                            (tile - columnStart) * TILE_WIDTH, (row - rowStart) * TILE_HEIGHT, // destination position
                            TILE_WIDTH, TILE_HEIGHT, // destination size
                        );
                    }
                }
            }
        }
        
    }
}