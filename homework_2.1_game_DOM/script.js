import Ship from "./Ship.js";

const board = document.getElementById("board");
const SIZE = 50 /*10% of board size*/;
const BOARD_SIZE = SIZE * 10;
//random  func
function getRandom(){
    const steps = Math.floor((BOARD_SIZE-SIZE) / SIZE);               // how many steps fit in max (50 for 500 / 10)
    return Math.floor(Math.random() * (steps + 1)) * SIZE;
}
//player
const ship = new Ship(BOARD_SIZE -SIZE,BOARD_SIZE - SIZE, SIZE, 'black');
board.appendChild(ship.id());
ship.show();
//bombs/enemies
const matrix = []
const bombs = [];

const bombTimer = setInterval(() => {
    // 1. move existing bombs down and check for game over
    for (const bomb of bombs) {
        bomb.move(0, SIZE);
        if (bomb.positionY() >= BOARD_SIZE) {
            clearInterval(bombTimer);
            alert("You lost!");
            window.location.reload();
            return;
        }
    }

    // 2. spawn a new row of bombs
    for (let i = 0; i < 3; i++) {
        const bomb = new Ship(getRandom(), 0, SIZE, 'red');
        board.appendChild(bomb.id());
        bomb.show();
        bombs.push(bomb);
    }
}, 1000);

// ship handling
addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':{
            //bullet
            const bullet = new Ship(ship.positionX()+(SIZE/3), BOARD_SIZE - (SIZE), SIZE / 3, 'orange');
            board.appendChild(bullet.id());
            const bulletTimer = setInterval(() => {
                const hit = bombs.find(b =>
                    b.positionX() === bullet.positionX() - SIZE / 3 &&
                    b.positionY() + SIZE === bullet.positionY()+SIZE
                );
                if (hit) {
                    hit.hide();
                    bombs.splice(bombs.indexOf(hit), 1);
                    bullet.hide();
                    clearInterval(bulletTimer);
                } else if (bullet.positionY() >= SIZE) {
                    bullet.move(0, -SIZE);
                } else {
                    bullet.hide();
                    clearInterval(bulletTimer);
                }
            }, 500);
            break;
        }
        case 'ArrowLeft':{
            if(ship.positionX() > 0){
                ship.move(-SIZE,0);
                break;
            }else{
                break;
            }
        }
        case 'ArrowRight':{
            if(ship.positionX() < BOARD_SIZE - SIZE){
                ship.move(SIZE,0);
                break;
            }else{
                break;
            }
        }
    }
});

