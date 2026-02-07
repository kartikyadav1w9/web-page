const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timeLeftEl = document.getElementById("timeLeft");
const startBtn = document.getElementById("startBtn");
const timeIcon = document.getElementById("timeIcon");

let score = 0;
let highScore = localStorage.getItem("tileHighScore") || 0;
let activeTile = null;
let timeLeft = 3;
let timer = null;
let playing = false;
let playStartTime = null;

highScoreEl.textContent = highScore;

/* CREATE GRID */
for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.index = i;
    tile.addEventListener("click", () => handleClick(tile));
    grid.appendChild(tile);
}

/* START / RESET */
startBtn.onclick = () => {
    resetGame();
    playing = true;
    playStartTime = Date.now();
    nextTile();
    startTimer();
    startBtn.textContent = "Reset";
};

/* TILE CLICK */
function handleClick(tile) {
    if (!playing) return;

    if (tile === activeTile) {
        score++;
        scoreEl.textContent = score;
        timeLeft = 3;
        nextTile();
    } else {
        tile.classList.add("wrong");
        setTimeout(() => tile.classList.remove("wrong"), 200);
    }
}

/* NEXT TILE */
function nextTile() {
    if (activeTile) activeTile.classList.remove("active");
    const tiles = document.querySelectorAll(".tile");
    activeTile = tiles[Math.floor(Math.random() * tiles.length)];
    activeTile.classList.add("active");
}

/* TIMER */
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft -= 0.05;
        timeLeftEl.textContent = timeLeft.toFixed(2);

        if (timeLeft <= 0) endGame();
    }, 50);
}

/* GAME OVER */
function endGame() {
    playing = false;
    clearInterval(timer);
    if (activeTile) activeTile.classList.remove("active");

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("tileHighScore", highScore);
        highScoreEl.textContent = highScore;
    }

    alert("Game Over!");
}

/* RESET */
function resetGame() {
    score = 0;
    scoreEl.textContent = score;
    timeLeft = 3;
    timeLeftEl.textContent = "3.00";
    clearInterval(timer);
}

/* EASTER EGG TIME */
timeIcon.onclick = () => {
    if (!playStartTime) return;
    const seconds = Math.floor((Date.now() - playStartTime) / 1000);
    alert(`You played for ${seconds} seconds`);
};
