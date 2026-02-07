const SIZE = 8;
const ROWS = 9; // 1 home row + 8 field

let board = [];
let selected = null;
let gameStarted = false;
let leftHome = new Set();

const gameEl = document.getElementById("game");
const btn = document.getElementById("startBtn");

const DIRS = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];

/* ---------- INIT ---------- */
function initBoard() {
    board = Array.from({ length: ROWS }, () => Array(SIZE).fill(null));
    leftHome.clear();
    selected = null;

    // 8 players
    for (let c = 0; c < SIZE; c++) {
        board[0][c] = "P";
    }

    // 8 enemies
    for (let c = 0; c < SIZE; c++) {
        board[ROWS - 1][c] = "E";
    }

    render();
}

/* ---------- RENDER ---------- */
function render() {
    gameEl.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (r === 0) cell.classList.add("safe");

            const v = board[r][c];
            if (v === "P") cell.classList.add("player");
            if (v === "E") cell.classList.add("enemy");

            cell.onclick = () => onCellClick(r, c);
            gameEl.appendChild(cell);
        }
    }
}

/* ---------- INPUT ---------- */
function onCellClick(r, c) {
    if (!gameStarted) return;

    if (board[r][c] === "P") {
        selected = { r, c };
        render();
        highlightMoves(r, c);
        return;
    }

    if (selected) {
        tryMove(r, c);
    }
}

/* ---------- HIGHLIGHT ---------- */
function highlightMoves(r, c) {
    document.querySelectorAll(".cell").forEach(x =>
        x.classList.remove("move", "attack")
    );

    DIRS.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (!board[nr]?.hasOwnProperty(nc)) return;

        if (nr === 0 && leftHome.has(`${r},${c}`)) return;

        const idx = nr * SIZE + nc;
        const cell = gameEl.children[idx];

        if (board[nr][nc] === null) cell.classList.add("move");
        if (board[nr][nc] === "E") cell.classList.add("attack");
    });
}

/* ---------- PLAYER MOVE ---------- */
function tryMove(toR, toC) {
    const { r, c } = selected;

    if (Math.abs(toR - r) > 1 || Math.abs(toC - c) > 1) return;
    if (toR === 0 && leftHome.has(`${r},${c}`)) return;
    if (board[toR][toC] === "P") return;

    if (r === 0 && toR !== 0) leftHome.add(`${toR},${toC}`);

    board[r][c] = null;
    board[toR][toC] = "P";

    selected = null;
    render();
    if (checkWin()) return;
    setTimeout(enemyTurn, 400);
}

/* ---------- ENEMY AI ---------- */
function enemyTurn() {
    let enemies = [];
    let players = [];

    for (let r = 1; r < ROWS; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === "E") enemies.push({ r, c });
            if (board[r][c] === "P") players.push({ r, c });
        }
    }

    if (!enemies.length || !players.length) return;

    // Pick a random enemy each turn
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];

    /* -------- ATTACK (absolute priority, all 8 directions) -------- */
    for (let [dr, dc] of DIRS) {
        const nr = enemy.r + dr;
        const nc = enemy.c + dc;
        if (board[nr]?.[nc] === "P") {
            board[enemy.r][enemy.c] = null;
            board[nr][nc] = "E";
            render();
            checkWin();
            return; // TURN USED
        }
    }

    /* -------- MOVE TOWARD NEAREST PLAYER -------- */
    players.sort((a, b) =>
        Math.abs(a.r - enemy.r) + Math.abs(a.c - enemy.c) -
        (Math.abs(b.r - enemy.r) + Math.abs(b.c - enemy.c))
    );

    const target = players[0];

    // Try best direction first, then alternatives
    const preferredDirs = [
        [Math.sign(target.r - enemy.r), Math.sign(target.c - enemy.c)],
        [Math.sign(target.r - enemy.r), 0],
        [0, Math.sign(target.c - enemy.c)],
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    for (let [dr, dc] of preferredDirs) {
        const nr = enemy.r + dr;
        const nc = enemy.c + dc;

        if (
            nr > 0 &&                     // cannot enter player home row
            board[nr]?.[nc] === null
        ) {
            board[enemy.r][enemy.c] = null;
            board[nr][nc] = "E";
            render();
            checkWin();
            return; // TURN USED
        }
    }

    // If we reach here → enemy is fully blocked
    // This is the ONLY legitimate "skip"
}

/* ---------- WIN / LOSE ---------- */
function checkWin() {
    let p = 0, e = 0;
    board.flat().forEach(v => {
        if (v === "P") p++;
        if (v === "E") e++;
    });

    if (p === 0) {
        alert("You Lose");
        gameStarted = false;
        btn.textContent = "Start Game";
        return true;
    }
    if (e === 0) {
        alert("You Win");
        gameStarted = false;
        btn.textContent = "Start Game";
        return true;
    }
    return false;
}

/* ---------- START / RESET ---------- */
btn.onclick = () => {
    if (!gameStarted) {
        gameStarted = true;
        btn.textContent = "Reset";
        initBoard();
    } else {
        gameStarted = false;
        btn.textContent = "Start Game";
        initBoard();
    }
};

initBoard();
