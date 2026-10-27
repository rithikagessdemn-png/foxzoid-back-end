const mainbg =document.querySelector(".bg1");
const hitbox=document.querySelector(".hitbox");
const zoomOverlay=document.querySelector(".zoomoverlay");
const clue=document.querySelectorAll(".clue");
const closeBtn = document.querySelector(".closebtn");
const slots = document.querySelectorAll('.slot');
const homebtn=document.querySelector(".homebtn");
const playbtn=document.querySelector(".playbtn");
const closeBtn2 = document.querySelector(".closebtn2");
const finalPanel = document.getElementById("finalPanel");
const lastoptions = document.getElementById("lastoptions");

let firstSelectedSlot = null;

hitbox.addEventListener('click', () =>{
    zoomOverlay.style.display='flex';
    closeBtn.style.display='block';
    mainbg.style.filter ="blur(5px)";
    hitbox.style.pointeerEvents ='none';
});
closeBtn.addEventListener('click', () => {
    zoomOverlay.style.display = 'none';
    closeBtn.style.display = 'none';
    mainbg.style.filter = "none"; // Remove blur
    console.log("Zoom closed");
});
function setupBoxColors() {
    const order = [
        'pink', 'red',    'blue',   // Row 1
        'red',    'pink', 'red',    // Row 2
        'pink', 'blue',   'blue'    // Row 3
    ];

    order.forEach((color, index) => {
        const slot = document.getElementById(`slot${index + 1}`);
        slot.classList.remove('pink', 'red', 'blue');
        slot.classList.add(color);
    });
}
setupBoxColors();

slots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
        if (!firstSelectedSlot) {
            // First Click: Highlight and select
            firstSelectedSlot = { element: slot, index: index };
            slot.classList.add('selected');
        } else {
            // Second Click: Check if it's a neighbor
            if (isNeighbor(firstSelectedSlot.index, index)) {
                swapSlots(firstSelectedSlot.element, slot);
            }
            
            // Clear selection regardless
            firstSelectedSlot.element.classList.remove('selected');
            firstSelectedSlot = null;
        }
    });
});
function isNeighbor(idx1, idx2) {
    const row1 = Math.floor(idx1 / 3);
    const col1 = idx1 % 3;
    const row2 = Math.floor(idx2 / 3);
    const col2 = idx2 % 3;

    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);

    // Adjacent means difference in row + difference in column equals exactly 1
    return (rowDiff + colDiff === 1);
}
function swapSlots(slot1, slot2) {
    const colorClasses = ['pink', 'red', 'blue'];
    
    let color1 = colorClasses.find(c => slot1.classList.contains(c));
    let color2 = colorClasses.find(c => slot2.classList.contains(c));

    if (color1 && color2) {
        // 1. Add the rotation class to both
        slot1.classList.add('rotating');
        slot2.classList.add('rotating');

        // 2. Perform the actual color swap
        slot1.classList.remove(color1);
        slot2.classList.remove(color2);
        slot1.classList.add(color2);
        slot2.classList.add(color1);
        
        // 3. Remove the rotating class after the animation ends (0.4s)
        setTimeout(() => {
            slot1.classList.remove('rotating');
            slot2.classList.remove('rotating');
            
            // 4. Check for win AFTER the animation and swap are done
            checkWinCondition(); 
        },1000);
    }
}
const winningOrder = [
    'pink', 'red',    'blue',   
    'pink',    'red', 'blue',    
    'pink', 'red',   'blue'    
];
const winningOrder2 = [
    'blue', 'red',    'pink',   
    'blue',    'red', 'pink',    
    'blue', 'red',   'pink'    
];
function checkWinCondition() {

    const currentSlots = document.querySelectorAll('.slot');


    let isMatch1 = true;

    currentSlots.forEach((slot, index) => {

        if (!slot.classList.contains(winningOrder[index])) {

            isMatch1 = false;

        }

    });

    let isMatch2 = true;

    currentSlots.forEach((slot, index) => {

        if (!slot.classList.contains(winningOrder2[index])) {

            isMatch2 = false;

        }

    });

    if (isMatch1 || isMatch2) {

        handleWin();

    }

}
function handleWin() {
    console.log("Puzzle Solved!");
    
    // 1. Hide the puzzle overlay
    zoomOverlay.style.display = 'none';
    
    // 2. Change the main game background to the "Open Door" version
    // Use '2.jpg' which shows the door with the completed puzzle
    mainbg.src = "../../assets/room10/2.webp"; 
    closeBtn.style.display = 'none';
    mainbg.style.filter = "none";
    // 3. Disable the puzzle hitbox so it can't be clicked again
    hitbox.style.pointerEvents = "none";
   setTimeout(() =>{
    mainbg.src  ="../../assets/room10/3.webp";
   },50);
   setTimeout(() => {
    finalPanel.style.display = 'block';
    lastoptions.style.display='flex';
    closeBtn2.style.display='block';
    console.log("Success Panel Displayed");
    mainbg.style.filter ="blur(5px)";
    
    // Show ad in inventory position after final panel appears
    setTimeout(() => {
        const panelAd = document.querySelector('.panel-ad');
        panelAd.style.display = 'block';
        panelAd.style.bottom = '10px'; // Move ad lower to avoid button overlap
        panelAd.style.height = '200px'; // Reduce height to avoid overlap
        panelAd.style.zIndex = '999'; // Lower z-index than buttons
        (adsbygoogle = window.adsbygoogle || []).push({});
    }, 1000);
   }, 100); 

}

homebtn.addEventListener("click", () => {
  navigateWithLoader("../home_page/home.html");
});

playbtn.addEventListener("click", () => {
  let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
  if (unlockedLevel < 11) {
    localStorage.setItem('unlockedLevel', 11);
  }
  navigateWithLoader("../level_page/levels1-10.html");
});

closeBtn2.addEventListener("click", () => {
  location.reload();
});