class Player {
    constructor(ctx){
        this.ctx = ctx;
        this.tileSize = 32;
        this.spriteImg = null;

        this.posTile = {
            x: 10,
            y: 10
        };
        this.posModif = {
            x: 0,
            y: 0
        };
        this.moving = 0;
        this.direction = 'none';
        this.directionUpdate = {
            'up': [0, -1],
            'down': [0, 1],
            'left': [-1, 0],
            'right': [1, 0],
            'up-left': [-1, -1],
            'up-right': [1, -1],
            'down-left': [-1, 1],
            'down-right': [1, 1],
            'none': [0, 0]
        }
        this.speed = 100;

        this.initListeners();
    }

    initListeners(){
        window.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'w': this.move('up'); break;
                case 's': this.move('down'); break;
                case 'a': this.move('left'); break;
                case 'd': this.move('right'); break;
            }
        });
    }

    move(dir){
        if(this.moving) return;
        this.direction = dir;
        this.moving = this.tileSize;
    }

    update(deltaTime){
        if(this.moving > 0){
            const [xModif, yModif] = this.directionUpdate[this.direction];
            let distanceToMove = this.speed * (deltaTime / 1000);
            
            if (distanceToMove > this.moving) {
                distanceToMove = this.moving;
            }
            this.posModif.x += xModif * distanceToMove;
            this.posModif.y += yModif * distanceToMove;

            this.moving -= distanceToMove;
            if(this.moving <= 0){
                this.posTile.x += xModif;
                this.posTile.y += yModif;
                this.posModif.x = 0;
                this.posModif.y = 0;
                this.moving = 0;
            }
        }
        

    }

    draw(){
        if(this.spriteImg.complete){
            this.ctx.drawImage(
                this.spriteImg,
                0, 0,
                this.tileSize, this.tileSize,
                this.tileSize*3 + this.posModif.x, this.tileSize*3 + this.posModif.y,
                this.tileSize, this.tileSize
            );
        }
        
    }

    getPosTile(){ return this.posTile; }
}