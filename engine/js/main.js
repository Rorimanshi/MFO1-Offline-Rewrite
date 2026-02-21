const WND_WIDTH = 224;
const WND_HEIGHT = 224;
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;
const WND_WIDTH_TILES = WND_WIDTH / TILE_WIDTH;
const WND_HEIGHT_TILES = WND_HEIGHT / TILE_HEIGHT;

const canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let pos = { x: 0, y: 0 };

const player = new Player(ctx);

const map = new Map(player);

const importer = new FileImporter(map, player);

function gameLoop(){
    ctx.clearRect(0, 0, WND_WIDTH, WND_HEIGHT);
    ctx.fillRect(pos.x, pos.y, 10, 10);
    map.draw(ctx);

    player.update();
    player.draw();
    
    requestAnimationFrame(gameLoop);
}
let inte = setInterval(() => {
    if(importer.done){
        gameLoop();
        clearInterval(inte)
    }
}, 100)

function loadImage(src){
    const newImg = new Image();
    newImg.src = src;
    newImg.onload = () =>{
        console.log(`${src} loaded`);
    };
    return newImg;
};