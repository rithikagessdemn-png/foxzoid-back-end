const clueArea = document.getElementById("clueArea");
const overlay = document.getElementById("overlay");
const sceneImage = document.getElementById("sceneImage");
const closeBtn = document.getElementById("closeBtn");
const letterArea = document.getElementById("letterArea");
const letterOpenArea = document.getElementById("letterOpenArea");
const clickArea = document.getElementById("clickArea");
const colorButtons = document.getElementById("colorButtons");
const redBtn = document.getElementById("redBtn");
const whiteBtn = document.getElementById("whiteBtn");
const yellowBtn = document.getElementById("yellowBtn");
const keyArea = document.getElementById("keyArea");
const slot = document.getElementById("slot");
const finalLockArea = document.getElementById("finalLockArea");
const lastoptions = document.getElementById("lastoptions");
const finalCloseBtn= document.getElementById("finalCloseBtn");
let isLetterOpen = false;
let isRipBoxOpen = false;
let redBtnState = 0;
let whiteBtnState = 0;
let yellowBtnState = 0;
let keyCollected = false;

// Show game when background loads
if (sceneImage.complete) {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('gameScreen').style.opacity = '1';
} else {
  sceneImage.onload = () => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('gameScreen').style.opacity = '1';
  };
}

// Preload completion panel image
const finalPanelImg = new Image();
finalPanelImg.src = "../../assets/room14/final_panel_14@2x.webp";



clueArea.addEventListener("click", () => {
    if (isLetterOpen === false)
        {
            overlay.src="../../assets/room14/letter_box_14@3x.webp";
        }
    if (isLetterOpen === true)
        {
            overlay.src="../../assets/room14/letter_open_14@3x@3x.webp";
        }

    overlay.style.left= "10px";
    overlay.style.top= "20px";
    overlay.style.width = "95%";
    overlay.style.height = "95%";
    sceneImage.classList.add("blur");
    overlay.classList.remove("hidden");
    closeBtn.classList.remove("hidden");
    clueArea.classList.add("disabled");
    letterArea.classList.remove("disabled");
  });

closeBtn.addEventListener("click", closeOverlayOnce);

function closeOverlayOnce() {
    // clueArea.classList.add("disabled")
    sceneImage.classList.remove("blur");
    overlay.classList.add("hidden");
    closeBtn.classList.add("hidden");
    clueArea.classList.remove("disabled");
    letterArea.classList.add("disabled");
    colorButtons.style.display = 'none';
    // letterOpenArea.classList.remove("disabled");
    // overlay.src =""
    // keypadWrapper.style.display = 'none';
    // isBoxOPen = false;
    // resetKeypad();
    // console.log("closed");
    // keyArea.classList.add("disabled");

  }

  letterArea.addEventListener("click", () => {
    overlay.src="../../assets/room14/letter_14@3x.webp";
    clueArea.classList.add("disabled");
    letterArea.classList.add("disabled");
    letterOpenArea.classList.remove("disabled");
  });

  letterOpenArea.addEventListener("click", () => {
    isLetterOpen = true
    overlay.src="../../assets/room14/letter_open_14@3x@3x.webp";
    letterOpenArea.classList.add("disabled");
  });

  clickArea.addEventListener("click", () => {
    if (isRipBoxOpen===false) 
    // if (!keyCollected) return;
    {
      sceneImage.classList.add("blur");
      overlay.classList.remove("hidden");
      letterOpenArea.classList.add("disabled");
      overlay.src="../../assets/room14/rip_box_1@3x.webp";
      closeBtn.classList.remove("hidden");
      overlay.classList.remove("hidden");
      closeBtn.classList.remove("hidden");//new img
      colorButtons.style.display = 'flex';
      colorButtons.style.left = '44.5%';
      redBtn.style.width = '73.5px';
      whiteBtn.style.width = '73.5px';
      yellowBtn.style.width = '73.5px';
      overlay.style.left= "0px";
      overlay.style.top= "0px";
      overlay.style.width = "100%";
      overlay.style.height = "100%";

    }
    if (isRipBoxOpen===true) 
      // if (!keyCollected) return;
      {
        sceneImage.classList.add("blur");
        overlay.classList.remove("hidden");
        overlay.src="../../assets/room14/rip_box_3@3x@3x@3x.webp";
        closeBtn.classList.remove("hidden");
        colorButtons.style.display = 'none';
      }
  });

redBtn.addEventListener('click', () => {
    redBtnState++;

    // Reset back to 0 if it goes past the last color
    if (redBtnState > 2) {
        redBtnState = 0;
    }

    // Change the image based on the state
    if (redBtnState === 0) {
        redBtn.src = "../../assets/room14/red_button.webp";
        console.log("Red Button is now RED");
    } else if (redBtnState === 1) {
        redBtn.src = "../../assets/room14/yellow.webp";
        console.log("Red Button is now YELLOW");
    } else if (redBtnState === 2) {
        redBtn.src = "../../assets/room14/white_button.webp";
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
      whiteBtn.src = "../../assets/room14/white_button.webp";
      console.log("white Button is now white");
  } else if (whiteBtnState === 1) {
      whiteBtn.src = "../../assets/room14/red_button.webp";
      console.log("white Button is now red");
  } else if (whiteBtnState === 2) {
      whiteBtn.src = "../../assets/room14/yellow.webp";
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
      yellowBtn.src = "../../assets/room14/yellow.webp";
      console.log("yellow Button is now yellow");
  } else if (yellowBtnState === 1) {
      yellowBtn.src = "../../assets/room14/red_button.webp";
      console.log("yellow Button is now red");
  } else if (yellowBtnState === 2) {
      yellowBtn.src = "../../assets/room14/white_button.webp";
      console.log("yellow Button is now white");
  }
  console.log("yellow button clicked");
  checkColorPuzzle();
});

function checkColorPuzzle() {
  if (redBtnState === 2  && yellowBtnState === 0 && whiteBtnState === 1 ) { 
      console.log("Puzzle Solved!");
      overlay.src="../../assets/room14/rip_box_2@3x@3x.webp";
      colorButtons.style.display = 'none';
      keyArea.classList.remove("disabled")
  }
}

keyArea.addEventListener("click", () => {
  overlay.src="../../assets/room14/rip_box_3@3x@3x@3x.webp";
  isRipBoxOpen = true;
  const inventoryKey = document.createElement("img");
  inventoryKey.src = "../../assets/room14/key_copy_3.webp";
  // inventoryKey.src = "key to open the door for room 1.png";
  inventoryKey.style.width = "30px";
  inventoryKey.draggable = true;
  slot.appendChild(inventoryKey);
  keyCollected = true
  sceneImage.src = "../../assets/room14/bg_2@3x@3x.webp";
  keyArea.classList.add("disabled")
  finalLockArea.classList.remove("disabled")
  slot.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "finalKey");
    });
});

finalLockArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

finalLockArea.addEventListener("drop", (e) => {
  e.preventDefault();
  const item = e.dataTransfer.getData("text/plain");
  if (item === "finalKey") {
    sceneImage.src = "../../assets/room14/bg_3@3x@3x@3x.webp";
    slot.style.display = "none";
    finalLockArea.classList.add("disabled");
    clickArea.classList.add("disabled");
    setTimeout(() => {
      sceneImage.classList.add("blur");
      overlay.src = "../../assets/room14/final_panel_14@2x.webp";
      overlay.classList.remove("hidden");
      lastoptions.style.display = 'flex';
      finalCloseBtn.classList.remove("hidden")
      
      // Show ad in inventory position after final panel appears
      setTimeout(() => {
          const panelAd = document.querySelector('.panel-ad');
          panelAd.style.display = 'block';
          panelAd.style.bottom = '10px'; // Move ad lower to avoid button overlap
          panelAd.style.height = '200px'; // Reduce height to avoid overlap
          panelAd.style.zIndex = '999'; // Lower z-index than buttons
          (adsbygoogle = window.adsbygoogle || []).push({});
      }, 1000);
    }, 1200)
  }            

});


finalCloseBtn.addEventListener("click", () => {
  location.reload();
});

document.querySelector(".homebtn").addEventListener("click", () => {
  navigateWithLoader("../home_page/home.html");
});

document.querySelector(".nextbtn").addEventListener("click", () => {
  let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
  if (unlockedLevel < 15) {
    localStorage.setItem('unlockedLevel', 15);
  }
  navigateWithLoader("../level_page/levels11-15.html");
});
