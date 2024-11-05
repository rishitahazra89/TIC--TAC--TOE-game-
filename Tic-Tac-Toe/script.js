let board = ["", "", "", "", "", "", "", "", ""];
let playerScore = 0;
let aiScore = 0;
const playerSymbol = "X";
const aiSymbol = "O";

const cells = Array.from({ length: 9 }, (_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => makeMove(i, playerSymbol));
    document.getElementById("game-board").appendChild(cell);
    return cell;
});

function makeMove(index, symbol) {
    if (board[index] !== "") return;
    
    board[index] = symbol;
    cells[index].textContent = symbol;
    if (checkWin(symbol)) {
        updateScore(symbol);
        resetBoard();
        return;
    }
    if (board.every(cell => cell !== "")) {
        resetBoard();
        return;
    }
    if (symbol === playerSymbol) {
        const aiMove = findBestMove();
        makeMove(aiMove, aiSymbol);
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    board.forEach((cell, i) => {
        if (cell === "") {
            board[i] = aiSymbol;
            const score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    });
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(aiSymbol)) return 10 - depth;
    if (checkWin(playerSymbol)) return depth - 10;
    if (board.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = aiSymbol;
                const eval = minimax(board, depth + 1, false);
                board[i] = "";
                maxEval = Math.max(maxEval, eval);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = playerSymbol;
                const eval = minimax(board, depth + 1, true);
                board[i] = "";
                minEval = Math.min(minEval, eval);
            }
        }
        return minEval;
    }
}

function checkWin(symbol) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === symbol)
    );
}

function updateScore(symbol) {
    if (symbol === playerSymbol) playerScore++;
    else aiScore++;

    document.getElementById("player-score").textContent = playerScore;
    document.getElementById("ai-score").textContent = aiScore;
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => (cell.textContent = ""));
}

function resetGame() {
    resetBoard();
}

function resetScores() {
    playerScore = 0;
    aiScore = 0;
    document.getElementById("player-score").textContent = playerScore;
    document.getElementById("ai-score").textContent = aiScore;
    resetBoard();
}
