const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* RESPONSIVE CANVAS */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.6;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* HUD */
const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");

/* SOUNDS */
let bgMusic = new Audio("assets/audio/music/music.mp3");
bgMusic.loop = true;

document.addEventListener("keydown", () => {
    bgMusic.play();
}, { once: true });


/* START MUSIC ON FIRST TOUCH */
document.addEventListener("click", () => music.play(), { once: true });

/* PLAYER */
const playerImg = new Image();
playerImg.src = "assets/images/characters/kid.png";

const player = {
    x: 80,
    y: 0,
    w: 70,
    h: 70,
    vy: 0,
    gravity: 1.1,
    jump: -20,
    grounded: false
};

/* OBSTACLES (MULTIPLE TYPES) */
const obstacleImages = [
    { img: "assets/images/obstacles/rock.png", w: 50, h: 50 },
    { img: "assets/images/obstacles/spike.png", w: 40, h: 60 }
];

let obstacles = [];

/* GAME STATE */
let speed = 6;
let score = 0;
let level = 1;
let gameOver = false;

/* SPAWN OBSTACLE */
function spawnObstacle() {
    const type = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    const img = new Image();
    img.src = type.img;

    obstacles.push({
        img,
        x: canvas.width + Math.random() * 300,
        y: canvas.height - type.h - 20,
        w: type.w,
        h: type.h
    });
}

/* INPUT (TOUCH + KEYBOARD) */
function jump() {
    if (player.grounded) {
        player.vy = player.jump;
        player.grounded = false;
        jumpSound.play();
    }
}
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

/* UPDATE */
function update() {
    if (gameOver) return;

    // Player physics
    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y + player.h >= canvas.height - 20) {
        player.y = canvas.height - player.h - 20;
        player.vy = 0;
        player.grounded = true;
    }

    // Obstacles
    obstacles.forEach(o => o.x -= speed);
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
        spawnObstacle();
    }

    // Remove passed obstacles
    if (obstacles[0].x + obstacles[0].w < 0) {
        obstacles.shift();
        score++;
    }

    // Level system
    if (score % 10 === 0 && score !== 0) {
        level = Math.floor(score / 10) + 1;
        speed = 6 + level;
    }

    // Collision
    obstacles.forEach(o => {
        if (
            player.x < o.x + o.w &&
            player.x + player.w > o.x &&
            player.y < o.y + o.h &&
            player.y + player.h > o.y
        ) {
            hitSound.play();
            gameOver = true;
            alert("Game Over\nScore: " + score);
            location.reload();
        }
    });

    scoreText.innerText = score;
    levelText.innerText = level;
}

/* DRAW */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Player
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

    // Obstacles
    obstacles.forEach(o => ctx.drawImage(o.img, o.x, o.y, o.w, o.h));
}

/* LOOP */
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();
