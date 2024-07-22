const columns = 7;
const rows = 6;
const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
let currentPlayer = 'red';
let gameActive = true;

let grid = Array.from({ length: rows }, () => Array(columns).fill(null));

function createBoard() {
    board.innerHTML = ''; 
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.column = c;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;

    const column = parseInt(event.target.dataset.column, 10);
    for (let r = rows - 1; r >= 0; r--) {
        if (!grid[r][column]) {
            grid[r][column] = currentPlayer;
            updateBoard();
            if (checkWin(r, column)) {
                gameActive = false;
                status.textContent = `${currentPlayer.toUpperCase()} wins!`;
            } else if (grid.flat().every(cell => cell)) {
                gameActive = false;
                status.textContent = "It's a tie!";
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                status.textContent = `${currentPlayer.toUpperCase()}'s turn`;
            }
            break;
        }
    }
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cell = board.querySelector(`.cell[data-row="${r}"][data-column="${c}"]`);
            cell.classList.remove('red', 'yellow');
            if (grid[r][c]) {
                cell.classList.add(grid[r][c]);
            }
        }
    }
}

function checkWin(row, col) {
    const directions = [
        { rowDir: 0, colDir: 1 },  
        { rowDir: 1, colDir: 0 },  
        { rowDir: 1, colDir: 1 },  
        { rowDir: 1, colDir: -1 }  
    ];

    return directions.some(direction => {
        const count = 1 + checkDirection(row, col, direction.rowDir, direction.colDir) + checkDirection(row, col, -direction.rowDir, -direction.colDir);
        return count >= 4;
    });
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;
    while (r >= 0 && r < rows && c >= 0 && c < columns && grid[r][c] === currentPlayer) {
        count++;
        r += rowDir;
        c += colDir;
    }
    return count;
}

function resetGame() {
    grid = Array.from({ length: rows }, () => Array(columns).fill(null));
    gameActive = true;
    currentPlayer = 'red';
    status.textContent = `${currentPlayer.toUpperCase()}'s turn`;
    updateBoard();
}

createBoard();
status.textContent = `${currentPlayer.toUpperCase()}'s turn`;

resetButton.addEventListener('click', resetGame);
