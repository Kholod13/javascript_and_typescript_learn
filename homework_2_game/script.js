(function () {
    const main = document.querySelector('main');
    const SIZE = 10;
    const matrix = []; // matrix[row][col]

    for (let i = 0; i < SIZE; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        matrix[i] = [];

        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
            matrix[i][j] = cell;
        }

        main.appendChild(row);
    }

    matrix[9][7].style.backgroundColor = 'black';
})();