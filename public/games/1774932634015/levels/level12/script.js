// ==========================================
// 1. GAME CONFIGURATION & STATE
// ==========================================
let isKnobRevealed = false;
let mazeGameActive = false;

// Joystick movement vector
let joystickDelta = { x: 0, y: 0 };

// NEW: Keyboard movement state
let moveKeys = { Up: false, Down: false, Left: false, Right: false };

let player = {
    x: 0, y: 0,
    hitbox: 8,   // Small physical body to slide through gaps
    visual: 30,  // Large visible image
    speed: 2     // Max speed multiplier
};

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
// Scene Elements
const bgImage = document.getElementById("bgImage");
const doorKnobImg = document.getElementById("doorKnobImg");
const doorKnobHitbox = document.getElementById("doorKnobHitbox");
const doorDropZone = document.getElementById("doorArea");
const slot1 = document.getElementById("slot1");

// Show game when background loads
if (bgImage.complete) {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('gameScreen').style.opacity = '1';
} else {
    bgImage.onload = () => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('gameScreen').style.opacity = '1';
    };
}

// UI Elements
const closeBtn = document.getElementById("closeButton");
const levelPanel = document.getElementById("levelCompletePanel");

// Maze Elements
const mazeOverlay = document.getElementById('mazeOverlay');
const mazeCanvas = document.getElementById('mazeCanvas');
const ctx = mazeCanvas.getContext('2d', { willReadFrequently: true });

// ==========================================
// 3. IMAGE ASSETS
// ==========================================
const mazeImg = new Image();
mazeImg.src = "../../assets/room12/puzzle.webp";

const keyImg = new Image();
keyImg.src = "../../assets/room12/puzzle/key.webp";

mazeImg.onerror = () => console.error("Error: puzzle.webp not found");
keyImg.onerror = () => console.error("Error: key image not found");

// ==========================================
// 4. INTERACTION LOGIC (REVEAL & START)
// ==========================================
function handleKnobInteraction() {
    if (!isKnobRevealed) {
        doorKnobImg.classList.remove("hidden");
        closeBtn.classList.remove("hidden");

        setTimeout(() => {
            doorKnobImg.classList.add("moved");
            doorKnobHitbox.classList.add("moved");
            bgImage.classList.add("blur-bg");
        }, 50);

        isKnobRevealed = true;
    } else {
        closeBtn.classList.add("hidden");
        startMazeGame();
    }
}

doorKnobHitbox.addEventListener("click", handleKnobInteraction);
doorKnobImg.addEventListener("click", handleKnobInteraction);

closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    doorKnobImg.classList.add("hidden");
    closeBtn.classList.add("hidden");
    bgImage.classList.remove("blur-bg");
    doorKnobImg.classList.remove("moved");
    doorKnobHitbox.classList.remove("moved");
    isKnobRevealed = false;
});

// ==========================================
// 5. MAZE ENGINE
// ==========================================
function startMazeGame() {
    mazeOverlay.classList.remove("hidden");
    mazeGameActive = true;

    mazeCanvas.width = 350;
    mazeCanvas.height = 350;

    player.x = 185;
    player.y = 160;

    requestAnimationFrame(updateMaze);
}

function updateMaze() {
    if (!mazeGameActive) return;

    ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    ctx.globalAlpha = 0.8;
    ctx.drawImage(mazeImg, 0, 0, mazeCanvas.width, mazeCanvas.height);
    ctx.globalAlpha = 1.0;

    // --- COMBINED INPUT CALCULATION ---
    let dx = joystickDelta.x;
    let dy = joystickDelta.y;

    // Keyboard overrides joystick if pressed
    if (moveKeys.Left) dx = -1;
    if (moveKeys.Right) dx = 1;
    if (moveKeys.Up) dy = -1;
    if (moveKeys.Down) dy = 1;

    // Normalize diagonal keyboard movement so the key doesn't speed up diagonally
    if (dx !== 0 && dy !== 0 && (moveKeys.Up || moveKeys.Down || moveKeys.Left || moveKeys.Right)) {
        let length = Math.sqrt(dx * dx + dy * dy);
        dx = dx / length;
        dy = dy / length;
    }

    let nextX = player.x + (dx * player.speed);
    let nextY = player.y + (dy * player.speed);
    // ----------------------------------

    // Collision Check
    if (!checkCollision(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }

    let drawX = player.x - (player.visual / 2) + (player.hitbox / 2);
    let drawY = player.y - (player.visual / 2) + (player.hitbox / 2);
    ctx.drawImage(keyImg, drawX, drawY, player.visual, player.visual);

    checkWin();
    requestAnimationFrame(updateMaze);
}

function checkCollision(x, y) {
    const points = [
        {x: x, y: y},
        {x: x + player.hitbox, y: y},
        {x: x, y: y + player.hitbox},
        {x: x + player.hitbox, y: y + player.hitbox}
    ];

    for (let point of points) {
        if (point.x < 0 || point.x >= mazeCanvas.width || point.y < 0 || point.y >= mazeCanvas.height) {
            return true;
        }

        const pixel = ctx.getImageData(point.x, point.y, 1, 1).data;
        if (pixel[3] > 200) {
            return true;
        }
    }
    return false;
}

function checkWin() {
    let dx = player.x - (mazeCanvas.width / 2);
    let dy = player.y - (mazeCanvas.height / 2);
    let distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

    if (distanceFromCenter > 160) {
        endMazeGame();
    }
}

function endMazeGame() {
    mazeGameActive = false;
    mazeOverlay.classList.add("hidden");
    bgImage.classList.remove("blur-bg");

    doorKnobImg.classList.add("hidden");
    doorKnobHitbox.style.display = "none";

    // Safety check: reset joystick/keys when game ends
    handleJoystickEnd();
    moveKeys = { Up: false, Down: false, Left: false, Right: false };

    addKeyToInventory();
}

// ==========================================
// 6. INVENTORY & DROP LOGIC
// ==========================================
function addKeyToInventory() {
    const invKey = document.createElement("img");
    invKey.src = keyImg.src;
    invKey.draggable = true;
    invKey.id = "inventoryKey";
    invKey.style.width = "40px"; invKey.style.height = "40px";

    slot1.appendChild(invKey);

    invKey.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setDragImage(e.target, 20, 20);
    });

    doorDropZone.classList.remove("disabled");
}

doorDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
});

doorDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const item = document.getElementById(id);

    if (item && item.id === "inventoryKey") {
        item.remove();

        doorKnobImg.classList.add("hidden");
        doorKnobHitbox.style.display = "none";
        bgImage.src = "../../assets/room12/2bg.webp";

        setTimeout(() => {
            levelPanel.classList.remove("hidden");
            bgImage.classList.add("blur-bg");
            
            // Show ad in inventory position after final panel appears
            setTimeout(() => {
                const panelAd = document.querySelector('.panel-ad');
                panelAd.style.display = 'block';
                panelAd.style.bottom = '10px'; // Move ad lower to avoid button overlap
                panelAd.style.height = '200px'; // Reduce height to avoid overlap
                panelAd.style.zIndex = '999'; // Lower z-index than buttons
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 1000);
        }, 1200);
    }
});

// ==========================================
// 7. VIRTUAL JOYSTICK ENGINE
// ==========================================
const joystickBase = document.getElementById('joystick-base');
const joystickStick = document.getElementById('joystick-stick');
let isDragging = false;
const maxRadius = 35; // How far the stick can stretch from the center

function handleJoystickStart(e) {
    isDragging = true;
    if (joystickStick) joystickStick.classList.add('dragging');
    handleJoystickMove(e);
}

function handleJoystickMove(e) {
    if (!isDragging || !joystickBase) return;

    // Get touch or mouse coordinates
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Find the center of the joystick base
    let rect = joystickBase.getBoundingClientRect();
    let centerX = rect.left + rect.width / 2;
    let centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Clamp the stick so it doesn't leave the base ring
    if (distance > maxRadius) {
        dx = (dx / distance) * maxRadius;
        dy = (dy / distance) * maxRadius;
    }

    // Move the visual stick element
    if (joystickStick) {
        joystickStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    // Normalize the values (-1 to 1) and feed them to the game loop
    joystickDelta.x = dx / maxRadius;
    joystickDelta.y = dy / maxRadius;
}

function handleJoystickEnd() {
    isDragging = false;
    if (joystickStick) {
        joystickStick.classList.remove('dragging');
        joystickStick.style.transform = `translate(-50%, -50%)`; // Snap back to center
    }
    joystickDelta = { x: 0, y: 0 }; // Stop player movement
}

// Attach Joystick Events (Only if the joystick exists in the HTML)
if (joystickBase) {
    // Desktop Events
    joystickBase.addEventListener('mousedown', handleJoystickStart);
    window.addEventListener('mousemove', handleJoystickMove);
    window.addEventListener('mouseup', handleJoystickEnd);

    // Mobile Touch Events (with preventDefault to stop screen scrolling)
    joystickBase.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleJoystickStart(e);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            handleJoystickMove(e);
        }
    }, { passive: false });

    window.addEventListener('touchend', handleJoystickEnd);
}

// ==========================================
// 8. KEYBOARD CONTROLS (Arrows & WASD)
// ==========================================
window.addEventListener("keydown", (e) => {
    // Prevent default scrolling for arrow keys
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") moveKeys.Up = true;
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") moveKeys.Down = true;
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") moveKeys.Left = true;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") moveKeys.Right = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") moveKeys.Up = false;
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") moveKeys.Down = false;
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") moveKeys.Left = false;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") moveKeys.Right = false;
});

// ==========================================
// 9. PANEL BUTTONS
// ==========================================
document.getElementById("homeBtn").addEventListener("click", () => {
    navigateWithLoader("../home_page/home.html");
});

document.getElementById("nextBtn").addEventListener("click", () => {
    let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
    if (unlockedLevel < 13) {
        localStorage.setItem('unlockedLevel', 13);
    }
    navigateWithLoader("../level_page/levels11-15.html");
});