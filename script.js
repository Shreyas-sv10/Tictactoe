let board = Array(9).fill("");
let currentPlayer = "X";
let gameMode = "ai"; // "pvp" or "ai"
let difficulty = "easy";
let gameOver = false;
let scores = { player: 0, ai: 0 };
let soundOn = true;
let isDark = false;

const cells = document.querySelectorAll(".cell");
const turnDisplay = document.getElementById("turn-display");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("result-text");
const playerScore = document.getElementById("player-score");
const aiScore = document.getElementById("ai-score");

function chooseMode() {
  hideAll();
  document.getElementById("mode-menu").classList.remove("hidden");
}

function setMode(mode) {
  gameMode = mode;
  startGame();
}

function setDifficulty(level) {
  difficulty = level;
  backToMenu();
}

function showAbout() {
  hideAll();
  document.getElementById("about").classList.remove("hidden");
}

function backToMenu() {
  hideAll();
  document.getElementById("main-menu").classList.remove("hidden");
}

function goToMenu() {
  resetGame();
  backToMenu();
}

function exitGame() {
  alert("Thanks for playing, Shreyas!");
}

function startGame() {
  hideAll();
  resetGame();
  document.getElementById("game-container").classList.remove("hidden");
  updateTurnDisplay();
}

function resetGame() {
  board = Array(9).fill("");
  gameOver = false;
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.pointerEvents = "auto";
  });
  resultBox.classList.add("hidden");
  updateTurnDisplay();
}

function makeMove(index) {
  if (gameOver || board[index] !== "") return;
  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].style.pointerEvents = "none";

  if (checkWinner(currentPlayer)) {
    endGame(`${currentPlayer === "X" ? "You" : "AI"} Win!`);
    if (currentPlayer === "X") scores.player++;
    else scores.ai++;
    updateScores();
    return;
  }

  if (!board.includes("")) {
    endGame("It's a Draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();

  if (gameMode === "ai" && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function updateTurnDisplay() {
  turnDisplay.textContent = gameOver
    ? ""
    : currentPlayer === "X"
    ? "Your Turn (X)"
    : gameMode === "ai"
    ? "AI Turn (O)"
    : "Player 2 Turn (O)";
}

function updateScores() {
  playerScore.textContent = scores.player;
  aiScore.textContent = scores.ai;
}

function endGame(message) {
  gameOver = true;
  resultText.textContent = message;
  resultBox.classList.remove("hidden");
}

function aiMove() {
  let move;
  if (difficulty === "easy") move = getRandomMove();
  else if (difficulty === "medium") move = getMediumMove();
  else move = getBestMove();

  makeMove(move);
}

function getRandomMove() {
  let empty = board.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getMediumMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (checkWinner("O")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Block X
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (checkWinner("X")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  return getRandomMove();
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner("O", newBoard)) return 10 - depth;
  if (checkWinner("X", newBoard)) return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function checkWinner(player, customBoard = board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5],
    [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => customBoard[index] === player)
  );
}

// Theme & Sound
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
  document.getElementById("theme-toggle").textContent = isDark ? "☀️" : "🌙";
}

function toggleSound() {
  soundOn = !soundOn;
  alert(`Sound turned ${soundOn ? "on" : "off"}`);
}

function goFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function hideAll() {
  document.querySelectorAll(".menu, #game-container").forEach(div => div.classList.add("hidden"));
    }
