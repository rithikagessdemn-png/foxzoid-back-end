const pillow = document.querySelector(".hitbox");
const scrollItem = document.getElementById("clueItem");
const clueOverlay = document.getElementById("clue-overlay");
const closeClueBtn = document.getElementById("closebtn");
const hitbox2 = document.getElementById("hitbox2");
const boxoverlay = document.getElementById("boxoverlay");
const closebtn2 = document.getElementById("closebtn2");
const box1 = document.querySelector(".box1");
const keypadWrapper = document.getElementById("keypadWrapper");
const buttons = document.querySelectorAll('.num-btn');
const clueItem2=document.getElementById("clueItem2")
const clueOverlay2 = document.getElementById("clue-overlay2");
const closeClueBtn2 = document.getElementById("closebtn3");
const mainBg=document.getElementById("mainBg");
const doorlockBg=new Image();
doorlockBg.src='../../assets/room4/1@3x@3x.webp';
const hitbox3 = document.getElementById("hitbox3");
const doorOverlay = document.getElementById("doorOverlay");
const closeDoorBtn = document.getElementById("closeDoorBtn");
const doorButtons = document.querySelectorAll('.door-btn');
const finalOverlay = document.getElementById('finalOverlay');
const finalCloseBtn = document.getElementById('finalCloseBtn');
const homeBtn = document.getElementById('homeBtn');
const nextBtn = document.getElementById('nextBtn');

// Show game when background loads
if (mainBg.complete) {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('gameScreen').style.opacity = '1';
} else {
  mainBg.onload = () => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('gameScreen').style.opacity = '1';
  };
}


// --- Game State Variables ---
let hasScrollBeenTaken = false;
let isSafeCodeSolved = false;
let hasSeenClue = false;
let isBoxOPen = false; // "false" means looking at the safe, "true" means keypad is active
let enteredCode = "";
const correctCode = "160";
let isPaperCollected =false;
let hasScrollBeenTaken2 = false;
let hasSeenClue2 = false;

let doorEnteredCode = "";
const correctDoorCode = "0714";

// --- 1. Pillow & Clue Logic ---
pillow.addEventListener('click', () => {
    if (!hasScrollBeenTaken) {
        scrollItem.style.display = 'block';
        hasScrollBeenTaken = true;
        pillow.style.cursor = 'default';
        console.log("You found a hidden sheet behind the pillow!");
    }
});

scrollItem.addEventListener('click', () => {
    if (hasScrollBeenTaken) {
        clueOverlay.style.display = 'block';
        scrollItem.style.visibility = 'hidden';
        hasSeenClue = true;
        hitbox2.style.pointerEvents = 'auto';
        console.log("Viewing clue: 160");
    }
});

closeClueBtn.addEventListener('click', () => {
    clueOverlay.style.display = 'none';
    scrollItem.style.visibility = 'visible';
});

// --- 2. Safe Zoom & Keypad Activation ---
hitbox2.addEventListener('click', () => {
    if (hasSeenClue && !isPaperCollected) {
        boxoverlay.style.display = 'block';
        scrollItem.style.visibility = 'hidden';
    }
    else if(isPaperCollected){
        console.log("no need to lock");
        hitbox2.style.pointerEvents='none';
    }
});

box1.addEventListener('click', function() {
    if (!isBoxOPen) {
        // Change the safe door image to the keypad background
        this.src = '../../assets/room4/8@3x_1.webp';
        keypadWrapper.style.display = 'block';
        isBoxOPen = true;
        console.log("Keypad Active");
    }
    else if (isBoxOPen && isSafeCodeSolved) {
        // 1. Change safe image to empty version
        this.src = '../../assets/room4/clue5@3x@3x@3x@3x.webp';
        
        // 2. Show the paper in your inventory bar
        clueItem2.style.display = 'block';
        isPaperCollected=true;
        this.style.pointerEvents = 'none'; 
        hitbox2.style.pointerEvents = 'none';
        
        console.log("Paper collected! Safe is now empty.");
    }

});

// --- 3. Keypad Number Logic ---
buttons.forEach(btn => {
    const val = btn.getAttribute('data-val');
    
    // Paths for image swapping
    const normalPath = `../../assets/room4/digitallock/${val}@3x.webp`;
    const clickedPath = `../../assets/room4/whenweclick/${val}@3x.webp`; // Removed the leading slash

    btn.addEventListener('pointerdown', (e) => {
        if (!isBoxOPen) return;
        e.preventDefault();
        
        // Visual Feedback: Show clicked image (yellow/pressed)
        btn.src = clickedPath;
        
        // Logic for buttons
        if (val !== 'w' && val !== 'e') {
            enteredCode += val;
            console.log("Current Code: " + enteredCode);
            checkCode();
        } else if (val === 'w') {
            resetKeypad(); 
        }
    });
});

function checkCode() {
    if (enteredCode === correctCode) {
        isSafeCodeSolved = true;
        setTimeout(() => {
        
            // Change safe to opened image
            box1.src = '../../assets/room4/clue4@3x@3x@3x.webp'; 
            keypadWrapper.style.display = 'none';
        }, 300); // 300ms delay so user sees the last digit click
    } else if (enteredCode.length >= 3) {
        setTimeout(() => {
            
            resetKeypad();
        }, 300);
    }
}

function resetKeypad() {
    enteredCode = "";
    buttons.forEach(btn => {
        const val = btn.getAttribute('data-val');
        btn.src = `../../assets/room4/digitallock/${val}@3x.webp`;
    });
}

// --- 4. Close Button / Reset Everything ---
closebtn2.addEventListener('click', () => {
    boxoverlay.style.display = 'none';
    scrollItem.style.visibility = 'visible';
    
    // Reset Safe/Keypad for next time
    isBoxOPen = false;
    box1.src = '../../assets/room4/clue3@3x@3x.webp';
    keypadWrapper.style.display = 'none';
    resetKeypad();
});

clueItem2.addEventListener('click', () => {
    
        clueOverlay2.style.display = 'block';
        clueItem2.style.visibility = 'hidden';
        scrollItem.style.visibility = 'hidden';
        hasSeenClue2 =true;
        console.log("get 2nd clue");
    
    
});
closeClueBtn2.addEventListener('click', () => {
    clueOverlay2.style.display = 'none';
    clueItem2.style.visibility = 'visible';
    mainBg.src="../../assets/room4/1@3x@3x.webp";
    console.log("keypad door");
    hitbox3.style.pointerEvents = 'auto';
});
hitbox3.addEventListener('click', () => {
    doorOverlay.style.display = 'block';
    doorEnteredCode ="";
    clueItem2.style.visibility = 'hidden';
    scrollItem.style.visibility = 'hidden';

});
doorButtons.forEach(btn => {
    const val = btn.getAttribute('data-val');
    
    // Define exact paths for Normal and Clicked states
    const normalPath = `../../assets/room4/digitallock/${val}@3x.webp`;
    const clickedPath = `../../assets/room4/whenweclick/${val}@3x.webp`;

    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        
        // 1. Change to clicked image
        btn.src = clickedPath;
        
        // 2. Logic for buttons
        if (val !== 'w' && val !== 'e') {
            doorEnteredCode += val;
            console.log("Current Code: " + doorEnteredCode);
            doorcheckCode();
        } else if (val === 'w') {
            resetKeypad1(); 
        }
    });
});


function doorcheckCode() {
    if (doorEnteredCode === correctDoorCode) {
        setTimeout(() => {
            doorOverlay.style.display = 'none';
            mainBg.src  ="../../assets/room4/dooropen@3x.webp";
            hitbox3.style.pointerEvents = 'none';
            doorEnteredCode ="";
            
            setTimeout(() => {
                finalOverlay.style.display = 'block';
                
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
        }, 300);
    } else if (doorEnteredCode.length >= 4) {
        setTimeout(() => {
            resetKeypad1();
        }, 300);
    }
}

function resetKeypad1() {
    doorEnteredCode = "";
    doorButtons.forEach(btn => {
        const val = btn.getAttribute('data-val');
        // Force the path back to the base 'digital lock' folder
        btn.src = `../../assets/room4/digitallock/${val}@3x.webp`;
    });
    console.log("Keypad Reset - Absolute paths restored.");
}
closeDoorBtn.addEventListener('click', () => {
    doorOverlay.style.display = 'none';
    clueItem2.style.visibility = 'visible';
    keypadWrapper.style.display = 'none';
    resetKeypad1();
});

finalCloseBtn.addEventListener('click', () => {
    location.reload();
});

homeBtn.addEventListener('click', () => {
    navigateWithLoader("../home_page/home.html");
});

nextBtn.addEventListener('click', () => {
    let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
    if (unlockedLevel < 5) {
        localStorage.setItem('unlockedLevel', 5);
    }
    navigateWithLoader("../level_page/levels1-10.html");
});