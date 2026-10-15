(function () {
    const main = document.querySelector('main');
    const SIZE = 10;
    const BOMBS_PER_TICK = 3;
    const matrix = [];   // DOM-клетки
    let bombs = [];      // данные: bombs[row][col] === true / false
    const BOMB_INTERVAL = 1500;
    const BULLET_INTERVAL = BOMB_INTERVAL / 3;

    // создаём поле
    for (let i = 0; i < SIZE; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        matrix[i] = [];
        bombs[i] = new Array(SIZE).fill(false);

        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
            matrix[i][j] = cell;
        }
        main.appendChild(row);
    }

    function moveBullets() {
        bullets.forEach((b) => b.row--);                   // летим вверх
        bullets = bullets.filter((b) => b.row >= 0);       // вылетели за поле: удаляем
        // попадание в бомбу
        bullets = bullets.filter((b) => {
            if (bombs[b.row][b.col]) {
                bombs[b.row][b.col] = false;               // бомба уничтожена
                return false;                              // выстрел тоже исчезает
            }
            return true;
        });
    }

    function randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // сдвиг данных вниз на одну строку
    function shiftDown() {
        const next = [new Array(SIZE).fill(false)]; // новая пустая строка 0
        for (let i = 0; i < SIZE - 1; i++) {
            next.push(bombs[i]);                    // строка i становится i+1
        }
        bombs = next;                               // последняя строка выпадает
    }

    // новые бомбы в верхней строке
    function generateBombs() {
        for (let k = 0; k < BOMBS_PER_TICK; k++) {
            bombs[0][randomInt(SIZE)] = true;
        }
    }

    // отрисовка данных на поле
    function render() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                matrix[i][j].style.backgroundColor = bombs[i][j] ? 'red' : '';
            }
        }
        bullets.forEach((b) => {
            if (b.row >= 0) matrix[b.row][b.col].style.backgroundColor = 'orange';
        });
        matrix[playerRow][playerCol].style.backgroundColor = 'black';

        if (bombs[playerRow][playerCol]) {
            alert('Game over');
            window.location.reload();
        }
    }

    function startBombs() {
        let seconds = 0;

        const timerId = setInterval(() => {
            seconds++;

            shiftDown();
            generateBombs();
            render();

            if (seconds === 30) {
                clearInterval(timerId);
            }
        }, 1500);
    }

    let playerRow = 9;
    let playerCol = 7;
    let bullets = [];

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (e.repeat) return; // не стрелять очередью при удержании
                bullets.push({ row: playerRow - 1, col: playerCol });
                break;
            case 'ArrowLeft':
                if (playerCol > 0) playerCol--;
                break;
            case 'ArrowRight':
                if (playerCol < SIZE - 1) playerCol++;
                break;
            default:
                return;            // другие клавиши игнорируем
        }

        e.preventDefault();        // чтобы страница не прокручивалась стрелками
        setInterval(() => {
            moveBullets();
            render();
        }, BULLET_INTERVAL);
    });
    startBombs();
})();