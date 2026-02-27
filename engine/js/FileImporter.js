class FileImporter {
    constructor(map, player){
        this.done = false;
        this.progress = 0;

        this.map = map;
        this.player = player;

        this.importAll();
    }

    async importAll(){
        this.done = 
            await this.importMapInfo() && 
            await this.importTileset() &&
            await this.importPlayerSprite();
    }

    async importMapInfo(){
        try{
            const res = await fetch('../saves/savefile.json');
            const mapInfo = await res.json();
            this.map.data.tiles = mapInfo.map.tiles;
            this.map.data.collision = mapInfo.map.collision;
            
            return true;
        } catch(err){
            console.log('importMapInfo failed: ', err);
            return false;
        }
    }
    async importTileset(){
        try{
            this.map.img = await this.loadImage('../assets/img/tilesets/testTileset2.png')
            return true;
        } catch(err){
            console.log('importTileset failed: ', err);
            return false;
        }
    }

    async importPlayerSprite(){
        try{
            this.player.spriteImg = await this.loadImage('../assets/img/sprites/p_default.png')
            return true;
        } catch(err){
            console.log('importPlayerSprite failed: ', err);
            return false;
        }
    }

    async loadImage(src){
        return new Promise((resolve, reject) => {
            const newImg = new Image();
            newImg.onload = () => {
                resolve(newImg);
            };
            newImg.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };
            newImg.src = src;
        });
    }
}