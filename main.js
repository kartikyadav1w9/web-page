const monster = document.getElementById("monster");
const scoreDisplay = document.getElementById("score");

let score = 0;

// Move monster to random position
function moveMonster() {
    const area = document.getElementById("game-area");
    const maxX = area.clientWidth - 40;
    const maxY = area.clientHeight - 40;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    monster.style.left = x + "px";
    monster.style.top = y + "px";
}

// When monster is clicked
monster.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    moveMonster();
});

// Game loop: monster moves every 1.2 seconds
setInterval(moveMonster, 1200);

// Start game
moveMonster();
console.log("Monster Catch game started");
