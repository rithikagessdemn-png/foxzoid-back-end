const handle = document.getElementById("handle");
const bgImage = document.getElementById("bgImage");
const inventoryKey = document.getElementById('inventoryKey');
const popup = document.getElementById("popup");
const popup2 = document.getElementById("popup2");
const popupImg = document.getElementById("popup-img");
const arrows = document.querySelectorAll(".arrow-btn");

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

// Preload background image
const bg2 = new Image();
bg2.src = "../../assets/room11/bg_2.webp";

const KEY_POSITIONS = [
  { id: 0, top: 172, left: 172 },
  { id: 1, top: 172, left: 199 },
  { id: 2, top: 172, left: 237 },
  { id: 3, top: 120, left: 217 },
  { id: 4, top: 97, left: 236 },
  { id: 5, top: 135, left: 270 },
  { id: 6, top: 67, left: 202 },
  { id: 7, top: 210, left: 225 },
  { id: 8, top: 172, left: 268 },
  { id: 9, top: 210, left: 265 },
  { id: 10, top: 240, left: 240 },
  { id: 11, top: 272, left: 202 },
  { id: 12, top: 275, left: 260 },
  { id: 13, top: 307, left: 217 },
  { id: 14, top: 307, left: 172 },
  { id: 15, top: 307, left: 120 },
  { id: 16, top: 266, left: 82 },
  { id: 17, top: 266, left: 120 },
  { id: 18, top: 269, left: 165 },
  { id: 19, top: 237, left: 165 },
  { id: 20, top: 237, left: 192 },
  { id: 21, top: 240, left: 97 },
  { id: 22, top: 228, left: 135 },
  { id: 23, top: 202, left: 109 },
  { id: 24, top: 172, left: 101 },
  { id: 25, top: 135, left: 112 },
  { id: 26, top: 105, left: 157 },
  { id: 27, top: 67, left: 157 },
  { id: 28, top: 90, left: 105 },
  { id: 29, top: 74, left: 66 },
  { id: 30, top: 120, left: 30 },
  { id: 31, top: 171, left: 30 },
  { id: 32, top: 222, left: 30 },
  { id: 33, top: 213, left: 68 },
  { id: 34, top: 176, left: 68 },
  { id: 35, top: 151, left: 66 },
  { id: 36, top: 118, left: 74 }
];

const VALID_PATHS = [
  [0,1,2,3,4,5],
  [0,1,2,3,4,6],
  [0,1,2,3],
  [0,1,2,7,3,8],
  [0,1,2,8,9,10,11],
  [0,1,2,8,9,10,12,13,14,15,16,21,17,18,19,20,22,23,24,25,26,27,28,29,30,31,32],
  [0,1,2,8,9,10,12,13,14,15,16,21,17,18,19,20,22,23,24,25,26,27,28,29,30,31],
  [3,8],
  [3,4,6],
  [3,2],
  [2,7,3,8],
  [2,8,9,10,11],
  [2,8,9,10,12,13],
  [2,8,9,10,12,13,14,15,16,21,17,18,19,20,22,23,24,25,26,27,28,29,30,31],
  [2,8,9,10,12,13,14,15,16,21,17,18,19,20,22,23,24,25,26,27,28,29,30,31],
  [0,1],
  [1,2],
  [2,3],
  [3,4],
  [4,5],
  [4,6],
  [7,3],
  [2,8],
  [8,9],
  [9,10],
  [10,11],
  [10,12],
  [12,13],
  [13,14,15,16,21,17,18,19,20,22,23,24,25,26,27,28,29,30,31,32],
  [13,14,15,16,21,17,18,19,20,22,23,24,25,26,27,28,29,30,31],
  [2,7],
  [19,20,22,23,24,25,26,27,28,29,30,31,32],
  [19,22],
  [19,20],
  [22,23],
  [23,24,25,26,27,28,29,30,31,32],
  [24,25],
  [25,26],
  [26,27],
  [27,28],
  [28,29],
  [29,30],
  [30,31],
  [31,32],
  [21,33],
  [33,34],
  [34,35],
  [35,36]
];

function getValidNextMoves(path) {
  const validNext = new Set();
  const currentPos = path[path.length - 1];
  
  // Allow moving forward on valid paths that continue from current path
  VALID_PATHS.forEach(validPath => {
    if (validPath.length <= path.length) return;
    let matches = true;
    for (let i = 0; i < path.length; i++) {
      if (validPath[i] !== path[i]) {
        matches = false;
        break;
      }
    }
    if (matches) validNext.add(validPath[path.length]);
  });
  
  // Allow branching to new paths that start from current position
  VALID_PATHS.forEach(validPath => {
    if (validPath[0] === currentPos && validPath.length > 1) {
      validNext.add(validPath[1]);
    }
  });
  
  // Allow backtracking to immediate previous position
  if (path.length > 1) {
    validNext.add(path[path.length - 2]);
  }
  
  return Array.from(validNext);
}

let currentID = 0;
let visitedPath = [0];
let validPath = null;
let keyUsed = false;
let handleClicked = false;

function isValidPath() {
  return VALID_PATHS.some(validPath => {
    if (validPath.length < visitedPath.length) return false;
    for (let i = 0; i < visitedPath.length; i++) {
      if (validPath[i] !== visitedPath[i]) return false;
    }
    return true;
  });
}

function onIDChange(id) {
  validPath = isValidPath();
  console.log('Current ID:', id, 'Valid Path:', validPath);
}

function showKey(id) {
  KEY_POSITIONS.forEach(k => {
    const el = document.getElementById(`key${k.id}`);
    if (el) {
      el.style.display = k.id === id ? 'block' : 'none';
    }
  });
  onIDChange(id);
}

function moveKey(dir) {
  console.log('moveKey called with direction:', dir, 'currentID:', currentID);
  
  // Check if at position 31 and left arrow is pressed
  if (currentID === 31 && dir === "left") {
    popup2.style.display = "none";
    inventoryKey.classList.remove('hidden');
    return;
  }
  
  const currentPos = KEY_POSITIONS[currentID];
  const validNext = getValidNextMoves(visitedPath);
  console.log('Valid next moves:', validNext);
  const prevPos = visitedPath.length > 1 ? visitedPath[visitedPath.length - 2] : -1;
  
  const candidates = validNext.map(nextID => {
    const pos = KEY_POSITIONS[nextID];
    const dx = pos.left - currentPos.left;
    const dy = pos.top - currentPos.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isBacktrack = nextID === prevPos;
    
    let score = 0;
    if (dir === "right" && dx > 0) score = dx * 2 - Math.abs(dy);
    else if (dir === "left" && dx < 0) score = Math.abs(dx) * 2 - Math.abs(dy);
    else if (dir === "up" && dy < 0) score = Math.abs(dy) * 2 - Math.abs(dx);
    else if (dir === "down" && dy > 0) score = dy * 2 - Math.abs(dx);
    
    console.log(`Candidate ${nextID}: dx=${dx}, dy=${dy}, dir=${dir}, score=${score}`);
    return { id: nextID, score, distance, isBacktrack };
  }).filter(c => c.score > 0);
  
  console.log('Candidates:', candidates);
  
  if (candidates.length === 0) {
    console.log('No valid moves in this direction');
    return;
  }
  
  // Prioritize: backtrack > score > distance
  candidates.sort((a, b) => {
    if (a.isBacktrack !== b.isBacktrack) return b.isBacktrack - a.isBacktrack;
    if (b.score !== a.score) return b.score - a.score;
    return a.distance - b.distance;
  });
  
  const bestID = candidates[0].id;
  console.log('Moving to:', bestID);
  
  // Check if backtracking
  if (visitedPath.length > 1 && visitedPath[visitedPath.length - 2] === bestID) {
    visitedPath.pop();
    currentID = bestID;
  } else {
    // Moving forward or branching
    currentID = bestID;
    visitedPath.push(currentID);
  }
  showKey(currentID);
}

handle.addEventListener("click", () => {
  if (!handleClicked && !keyUsed) {
    handleClicked = true;
    popup.style.display = "flex";
  }
});

popupImg.addEventListener("click", (e) => {
  e.stopPropagation();
  popup.style.display = "none";
  popup2.style.display = "flex";
  currentID = 0;
  visitedPath = [0];
  showKey(0);
});

popup.addEventListener("click", (e) => {
  if (e.target !== popupImg) {
    popup.style.display = "none";
  }
});

popup2.addEventListener("click", (e) => {
  if (e.target === popup2) {
    popup2.style.display = "none";
  }
});

arrows.forEach(arrow => {
  arrow.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dir = arrow.getAttribute('data-dir');
    console.log('Arrow clicked:', dir);
    moveKey(dir);
  });
});

document.addEventListener("keydown", (e) => {
  if (popup2.style.display === "flex") {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      if (e.key === "ArrowUp") moveKey("up");
      if (e.key === "ArrowDown") moveKey("down");
      if (e.key === "ArrowLeft") moveKey("left");
      if (e.key === "ArrowRight") moveKey("right");
    }
  }
});

// Drag and drop key to handle
if (inventoryKey) {
  inventoryKey.setAttribute('draggable', 'true');
  
  inventoryKey.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'doorKey');
    inventoryKey.classList.add('dragging');
  });

  inventoryKey.addEventListener('dragend', () => {
    inventoryKey.classList.remove('dragging');
  });
}

if (handle) {
  handle.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  handle.addEventListener('drop', (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (item === 'doorKey' && !keyUsed) {
      keyUsed = true;
      bgImage.src = '../../assets/room11/bg_2.webp';
      inventoryKey.classList.add('hidden');
      
      setTimeout(() => {
        bgImage.classList.add('blur');
        document.getElementById('finalPanel11').classList.remove('hidden');
        document.getElementById('lastoptions11').style.display = 'flex';
        document.getElementById('panelCloseBtn11').classList.remove('hidden');
        
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
}


document.getElementById('panelCloseBtn11').addEventListener('click', () => {
  location.reload();
});

document.getElementById('homeBtn11').addEventListener('click', () => {
  navigateWithLoader('../home_page/home.html');
});

document.getElementById('nextBtn11').addEventListener('click', () => {
  let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
  if (unlockedLevel < 12) {
    localStorage.setItem('unlockedLevel', 12);
  }
  navigateWithLoader('../level_page/levels11-15.html');
});
