const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1;
let board = [];
let gameOver = false;
let gameStarted = false;

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

function makeHtmlBoard() {
  const gameBoard = document.getElementById('board');

  let top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  gameBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    gameBoard.append(row);
  }
}

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

function placeInTable(y, x) {
  const gamePiece = document.createElement('div');
  gamePiece.classList.add('piece');
  gamePiece.classList.add(`p${currPlayer}`);
  gamePiece.style.top = -50 * (y + 2);

  const dropColumn = document.getElementById(`${y}-${x}`);
  dropColumn.append(gamePiece);
}

function endGame(msg) {
  alert(msg);
}

function handleClick(evt) {
  if (!gameOver) {
    const x = +evt.target.id;

    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    placeInTable(y, x);
    board[y][x] = currPlayer;

    if (checkForWin()) {
      gameOver = true;
      return endGame(`Player ${currPlayer} won!`);
    }

    if (board.every((row) => row.every((square) => square))) {
      gameOver = true;
      return endGame('Tie!');
    }

    currPlayer = currPlayer === 1 ? 2 : 1;
  }
}

function checkForWin() {
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

const startGame = () => {
  makeBoard();
  makeHtmlBoard();
  gameStarted = true;
};

const startButton = document.querySelector('#start');
startButton.addEventListener('click', function () {
  if (!gameStarted) {
    startGame();
  }
});
