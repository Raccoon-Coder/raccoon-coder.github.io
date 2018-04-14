const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 360;
const CELL_SIZE = 20;

class Snake {
    constructor(x, y) {
        this.parts = [
            {x, y}
        ];
        this.direction = 'right';
    }

    get x () {
        return this.parts[0].x;
    }

    get y () {
        return this.parts[0].y;
    }

    eat() {
        this.hasEaten = true;
    }

    changeDirection(direction) {
        if(direction === 'up' && this.direction === 'down') {
            return;
        } else if(direction === 'down' && this.direction === 'up') {
            return;
        } else if(direction === 'right' && this.direction === 'left') {
            return;
        } else if(direction === 'left' && this.direction === 'right') {
            return;
        }

        this.direction = direction;
    }

    move() {
        const oldHead = this.parts[0];
        let newHead;
        if(this.direction === 'right') {
            newHead = {x: oldHead.x + 1, y: oldHead.y};
        } else if(this.direction === 'left') {
                newHead = {x: oldHead.x - 1, y: oldHead.y};
        } else if(this.direction === 'up') {
                newHead = {x: oldHead.x, y: oldHead.y - 1};
        } else if(this.direction === 'down') {
                newHead = {x: oldHead.x, y: oldHead.y + 1};
        }

        if(this.hasEaten){
            this.hasEaten = false;
        } else {
            this.parts.pop();
        }
        this.parts = [newHead, ...this.parts];
    }

    paint(context) {
        const border = 2;
        for(const part of this.parts) {
            const {x, y} = part;
            context.fillStyle = 'lightgray'; 
            context.fillRect(CELL_SIZE * x, CELL_SIZE * y, CELL_SIZE, CELL_SIZE);            
            context.fillStyle = 'blue'; 
            context.fillRect(CELL_SIZE * x + border, CELL_SIZE * y + border, CELL_SIZE - border * 2, CELL_SIZE - border * 2);
        }
    }

    eatSelf() {
        for(let i = 1; i < this.parts.length; i++) {
            if(this.parts[i].x === this.x && this.parts[i].y === this.y) {
                return true;
            }
        }
        return false;
    }

    isOutBounds(maxX, maxY) {
        if(this.x > maxX || this.x < 0 || this.y > maxY || this.y < 0) {
            return true;
        }
    }
};

class SnakeGame {
    constructor() {
        const canvas = document.getElementById('game-canvas');
        this.context = canvas.getContext('2d');
        this.gridWidth = CANVAS_WIDTH / CELL_SIZE;
        this.gridHeight = CANVAS_HEIGHT / CELL_SIZE;
        this.snake = new Snake(Math.floor(this.gridWidth / 2), Math.floor(this.gridHeight / 2)); 

        this.addEventListeners();
        this.moveByOne = this.moveByOne.bind(this);
    }

    addEventListeners() {
        const gameWindow = document.getElementById('snake-game');
        gameWindow.addEventListener('keydown', event => {
            event.preventDefault();
            if(!this.interval) {
                this.start();
            }
            if(event.key === 'ArrowRight' || event.key === 'd') {
                this.snake.changeDirection('right');
            }  else if(event.key === 'ArrowLeft' || event.key === 'a') {
                this.snake.changeDirection('left');
            } else if(event.key === 'ArrowUp' || event.key === 'w') {
                this.snake.changeDirection('up');
            } else if(event.key === 'ArrowDown' || event.key === 's') {
                this.snake.changeDirection('down');
            }
		})
	}

    addFood() {
        this.foodLocation = {
            x: Math.floor(Math.random() * (this.gridWidth - 1)),
            y: Math.floor(Math.random() * (this.gridHeight - 1)),
        };
        console.log(this.foodLocation);
    }

    start() {
        this.score = 0;
        this.addFood();
        this.snake = new Snake(Math.floor(this.gridWidth / 2), Math.floor(this.gridHeight / 2));
        this.interval = setInterval(this.moveByOne, 1000);
        document.getElementById('game-over-screen').style.display = 'none';
        this.score = 0;
        document.getElementById('js-score').innerHTML = this.score;
    }
    
    moveByOne() {
        this.snake.move();
        if(this.snake.eatSelf() || this.snake.isOutBounds(this.gridWidth - 1, this.gridHeight - 1)) {
            this.endGame();
            return;
        }
        if(this.snake.x === this.foodLocation.x && this.snake.y === this.foodLocation.y) {
            this.score += 1;
            document.getElementById('js-score').innerHTML = this.score;
            this.addFood();
            this.snake.eat();
            clearInterval(this.interval);
            this.interval = setInterval(this.moveByOne, Math.max(1000 * (0.90 ** this.score), 50));
        }
        this.paint();
    }
    endGame() {
        clearInterval(this.interval);
        document.getElementById('game-over-screen').style.display = 'block';
        this.interval = false;
    }
    paint() {
        this.context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT)
        this.snake.paint(this.context);
        this.paintFood();
    }

    paintFood() {
        this.context.fillStyle = 'red';
        this.context.fillRect(
            CELL_SIZE * this.foodLocation.x,
            CELL_SIZE * this.foodLocation.y,
            CELL_SIZE,
            CELL_SIZE
        );
    }
}

window.onload = () => {
    const game = new SnakeGame();
    game.start();
}