const  mainBg = document.getElementById("mainbg");
const hitbox1 = document.querySelector(".hitbox1");
const clue1 = document.querySelector(".clue1");

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

const closebtn = document.getElementById("closebtn");

const hitbox2 = document.querySelector(".hitbox2");
const clue2 = document.querySelector(".clue2");

const hitbox3 = document.querySelector(".hitbox3");
const clue3 = document.querySelector(".clue3");

const hitbox4 = document.querySelector(".hitbox4");
const clue4 = document.querySelector(".clue4");
const keypadWrapper = document.getElementById("keypadWrapper");
const buttons = document.querySelectorAll('.num-btn');

const hitbox5 = document.querySelector(".hitbox5");
const colorButtons = document.getElementById("colorButtons");
const redBtn = document.getElementById("redBtn");
const whiteBtn = document.getElementById("whiteBtn");
const yellowBtn = document.getElementById("yellowBtn");
const keypad = new Image();
keypad.src ='../../assets/room6/lock.webp';

const openDoorBg = document.getElementById("opendoor");

const finalPanel = document.getElementById("finalPanel");

const lastoptions=document.getElementById("lastoptions");
const homebtn=document.querySelector(".homebtn");
const playbtn=document.querySelector(".playbtn");
const closebtn2 = document.getElementById("closebtn2");

let isBoxOPen = false;
let enteredCode = "";
const correctCode = "68";
let redBtnState = 0;
let whiteBtnState = 0;
let yellowBtnState = 0;
let isCodeCorrect = false;

hitbox1.addEventListener('click', () => {
    
        clue1.style.display = 'block';
        closebtn.style.display = 'block';
        mainBg.style.filter = "blur(3px)";

        console.log("clue1");
    
});
closebtn.addEventListener('click', () => {
    clue1.style.display = 'none';
    mainBg.style.filter = "none";
    closebtn.style.display = 'none';
    clue2.style.display = 'none';
    clue3.style.display = 'none';
    clue4.style.display = 'none';
    clue4.src ='../../assets/room6/lock.webp'
    keypadWrapper.style.display = 'none';
    isBoxOPen = false;
    resetKeypad();
    console.log("closed");
    colorButtons.style.display = 'none';
    
});
hitbox2.addEventListener('click', () => {
    
    clue2.style.display = 'block';
    closebtn.style.display = 'block';
    mainBg.style.filter = "blur(3px)";

    console.log("clue2");

});

hitbox3.addEventListener('click', () => {
    
    clue3.style.display = 'block';
    closebtn.style.display = 'block';
    mainBg.style.filter = "blur(3px)";

    console.log("clue3");

});

hitbox4.addEventListener('click', () => {
    
    clue4.style.display = 'block';
    closebtn.style.display = 'block';
    mainBg.style.filter = "blur(3px)";

    console.log("clue3");

});
clue4.addEventListener('click', function() {
    if (!isBoxOPen) {
        
        this.src = '../../assets/room6/digitallock.webp';
        setTimeout( ()=>{
            keypadWrapper.style.display ='block';
        },500);
        
        isBoxOPen = true;
        console.log("Keypad Active");
    }
    else if(isBoxOPen && isCodeCorrect){
        this.src = '../../assets/room6/toy.webp';
        
    }
});

buttons.forEach(btn => {
    const val = btn.getAttribute('data-val');
    
    // Paths for image swapping
    const normalPath = `../../assets/room6/digitallockcroped/${val}@3x.webp`;
    const clickedPath = `../../assets/room6/whenweclick/${val}@3x${val === '8' ? '_2' : '_1'}.webp`;

    btn.addEventListener('pointerdown', (e) => {
        if (!isBoxOPen) return;
        e.preventDefault();
        
        
        btn.src = clickedPath;
        
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
        isCodeCorrect = true;
        hitbox5.style.display ='block';
        setTimeout(() => {
        
            
            clue4.src = '../../assets/room6/lockopen.webp'; 
            keypadWrapper.style.display = 'none';
        }, 50); // 300ms delay so user sees the last digit click
    } else if (enteredCode.length >= 2) {
        setTimeout(() => {
            
            resetKeypad();
        }, 300);
    }
}

function resetKeypad() {
    enteredCode = "";
    buttons.forEach(btn => {
        const val = btn.getAttribute('data-val');
        btn.src = `../../assets/room6/digitallockcroped/${val}@3x.webp`;
    });
}
hitbox5.addEventListener('click', () => {
    colorButtons.style.display = 'flex';
    closebtn.style.display = 'block';
    mainBg.style.filter = "blur(3px)";
    console.log("Color buttons revealed over the safe.");
});

// 3. Optional: Add logic for clicking the colored buttons
redBtn.addEventListener('click', () => {
    redBtnState++;

    // Reset back to 0 if it goes past the last color
    if (redBtnState > 2) {
        redBtnState = 0;
    }

    // Change the image based on the state
    if (redBtnState === 0) {
        redBtn.src = "../../assets/room6/redbutton.webp";
        console.log("Red Button is now RED");
    } else if (redBtnState === 1) {
        redBtn.src = "../../assets/room6/yellow.webp";
        console.log("Red Button is now YELLOW");
    } else if (redBtnState === 2) {
        redBtn.src = "../../assets/room6/whitebutton.webp";
        console.log("Red Button is now WHITE");
    }
    console.log("Red button clicked");
    checkColorPuzzle();
});
whiteBtn.addEventListener('click', () => {
    whiteBtnState++;

    // Reset back to 0 if it goes past the last color
    if (whiteBtnState > 2) {
        whiteBtnState = 0;
    }

    // Change the image based on the state
    if (whiteBtnState === 0) {
        whiteBtn.src = "../../assets/room6/whitebutton.webp";
        console.log("white Button is now white");
    } else if (whiteBtnState === 1) {
        whiteBtn.src = "../../assets/room6/redbutton.webp";
        console.log("white Button is now red");
    } else if (whiteBtnState === 2) {
        whiteBtn.src = "../../assets/room6/yellow.webp";
        console.log("white Button is now yellow");
    }
    console.log("white button clicked");
    checkColorPuzzle();
});
yellowBtn.addEventListener('click', () => {
    yellowBtnState++;

    // Reset back to 0 if it goes past the last color
    if (yellowBtnState > 2) {
        yellowBtnState = 0;
    }

    // Change the image based on the state
    if (yellowBtnState === 0) {
        yellowBtn.src = "../../assets/room6/yellow.webp";
        console.log("yellow Button is now yellow");
    } else if (yellowBtnState === 1) {
        yellowBtn.src = "../../assets/room6/redbutton.webp";
        console.log("yellow Button is now red");
    } else if (yellowBtnState === 2) {
        yellowBtn.src = "../../assets/room6/whitebutton.webp";
        console.log("yellow Button is now white");
    }
    console.log("yellow button clicked");
    checkColorPuzzle();
});
function checkColorPuzzle() {
    // Example: If the first button is White, the puzzle is solved
    if (redBtnState === 2  && yellowBtnState === 1 && whiteBtnState === 2 ) { 
        console.log("Puzzle Solved!");
        mainBg.src ="../../assets/room6/bg2.webp";
       

        const hitboxes = [hitbox1, hitbox2, hitbox3, hitbox4, hitbox5];
        hitboxes.forEach(box => {
            box.style.pointerEvents = 'none'; 
        });
        mainBg.style.filter = "none";
        colorButtons.style.display = 'none';
        closebtn.style.display = 'none';
        setTimeout(() => {
            finalPanel.style.display = 'block';
            lastoptions.style.display='flex';
            mainBg.style.filter = "blur(5px)";
            closebtn2.style.display = 'block';
            console.log("Success Panel Displayed");
            
            // Show ad in inventory position after final panel appears
            setTimeout(() => {
                const panelAd = document.querySelector('.panel-ad');
                panelAd.style.display = 'block';
                panelAd.style.bottom = '10px'; // Move ad lower to avoid button overlap
                panelAd.style.height = '200px'; // Reduce height to avoid overlap
                panelAd.style.zIndex = '999'; // Lower z-index than buttons
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 1000);
        }, 1200); // 0.5 second delay so they see the door open first


        
    }
}

homebtn.addEventListener('click', () => {
    navigateWithLoader('../home_page/home.html');
});

playbtn.addEventListener('click', () => {
    let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
    if (unlockedLevel < 7) {
        localStorage.setItem('unlockedLevel', 7);
    }
    navigateWithLoader('../level_page/levels1-10.html');
});

closebtn2.addEventListener('click', () => {
    location.reload();
});