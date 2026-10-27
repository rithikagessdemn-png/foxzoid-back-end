const smallBox=document.querySelector(".small-box");
const zoomOverlay=document.querySelector(".zoomoverlay");
const box1=document.querySelector(".box1");
const closeBtn=document.querySelector(".close-btn");
const mainBg=document.querySelector(".bg-img");
const inventoryKey =document.getElementById("key");
const doorlock=document.getElementById("doorlock")

const finalPanel = document.getElementById("finalPanel");

const lastoptions=document.getElementById("lastoptions");
const homebtn=document.getElementById("homeBtn");
const retrybtn=document.getElementById("retryBtn");
const closeBtn2=document.querySelector(".close-btn2");

// Debug: Check if elements are found
console.log('closeBtn found:', closeBtn);
console.log('closeBtn2 found:', closeBtn2);
console.log('homebtn found:', homebtn);
console.log('retrybtn found:', retrybtn);

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

// Preload images
const img1 = new Image();
img1.src = "../../assets/room3/gameplay2@3x@3x.webp";
const img2 = new Image();
img2.src = "../../assets/room3/gameplay3@3x@3x.webp";
const img3 = new Image();
img3.src = "../../assets/room3/gameplaybgfinal@3x@3x.webp";

let isBoxOPen=false;
let hasKeyBeenTaken=false;
let isBoxActive =true;


smallBox.addEventListener('click',() =>{
    if(isBoxActive){
        zoomOverlay.style.display='block';
    }
    
});

box1.addEventListener('click', function(){
    if(!isBoxOPen){
        this.src='../../assets/room3/gameplay2@3x@3x.webp';
        isBoxOPen=true; 
        
    }
    else if(isBoxOPen && !hasKeyBeenTaken){
        this.src = "../../assets/room3/gameplay3@3x@3x.webp";
        inventoryKey.style.display = 'block'; // Show key in inventory
        hasKeyBeenTaken = true;
        
        isBoxActive = false;
        smallBox.style.pointerEvents = 'none';
        smallBox.style.cursor = 'default';
    
        
    }
    
});

closeBtn.addEventListener('click',(e) =>{
    e.preventDefault();
    e.stopPropagation();
    console.log('Zoom close button clicked'); // Debug log
    console.log('closeBtn element:', closeBtn); // Debug log
    console.log('Event target:', e.target); // Debug log
    playClickSound();
    closeBtn.style.opacity = '0.6';
    // Add small delay to ensure sound plays
    setTimeout(() => {
        zoomOverlay.style.display='none';
        box1.src='../../assets/room3/gameplay1@3x.webp';
        closeBtn.style.opacity = '1'; // Reset opacity
    }, 100);
});

// key event to unlock the door

inventoryKey.addEventListener('dragstart', (e) =>{
    e.dataTransfer.setData("text", e.target.id);
});

doorlock.addEventListener('dragover',(e)=>{
    e.preventDefault();
});
doorlock.addEventListener('drop', (e) =>{
    e.preventDefault();
    const data=e.dataTransfer.getData("text");

    if(data === "key"){
        inventoryKey.style.display='none';
        doorlock.style.display='none';
        
        // Load final background image first
        const finalBg = new Image();
        finalBg.src = "../../assets/room3/gameplaybgfinal@3x@3x.webp";
        finalBg.onload = () => {
            mainBg.src = finalBg.src;
        };
        mainBg.src = "../../assets/room3/gameplaybgfinal@3x@3x.webp";
        
        setTimeout(() => {
            finalPanel.style.display = 'block';
            lastoptions.style.display='flex';
            mainBg.style.filter = "blur(5px)";
            closeBtn2.style.display='block';
            
            // Stop music when final panel appears
            if (window.gameEndMusicControl) {
                window.gameEndMusicControl.stopMusicForGameEnd();
            }
            
            // Show ad in inventory position after final panel appears
            setTimeout(() => {
                const panelAd = document.querySelector('.panel-ad');
                panelAd.style.display = 'block';
                panelAd.style.bottom = '10px'; // Move ad lower to avoid button overlap
                panelAd.style.height = '200px'; // Reduce height to avoid overlap
                panelAd.style.zIndex = '999'; // Lower z-index than buttons
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 1000);
            
            console.log("Success Panel Displayed");
        }, 1200);

        console.log("finally the door is open !!!");
    }
});

closeBtn2.addEventListener("click", () => {
    console.log('Close button clicked'); // Debug log
    if (window.gameEndMusicControl) {
        window.gameEndMusicControl.playClickSoundAndResumeMusic();
    } else {
        playClickSound();
    }
    closeBtn2.style.opacity = '0.6';
    // Add small delay before reload to ensure sound plays
    setTimeout(() => {
        location.reload();
    }, 150);
});

// Function to play click sound
function playClickSound() {
    console.log('playClickSound called'); // Debug log
    console.log('seamlessMusicManager:', window.seamlessMusicManager); // Debug log
    console.log('globalMusicManager:', window.globalMusicManager); // Debug log
    
    // Try multiple approaches to ensure sound plays
    const tryPlaySound = () => {
        if (window.seamlessMusicManager && window.seamlessMusicManager.initialized && window.seamlessMusicManager.clickSound) {
            console.log('Playing sound via seamlessMusicManager'); // Debug log
            window.seamlessMusicManager.playClickSound();
            return true;
        } else if (window.globalMusicManager && window.globalMusicManager.initialized && window.globalMusicManager.clickSound) {
            console.log('Playing sound via globalMusicManager'); // Debug log
            window.globalMusicManager.playClickSound();
            return true;
        }
        console.log('No music manager available or not initialized'); // Debug log
        return false;
    };
    
    // Fallback: try to play sound directly
    const playDirectSound = () => {
        try {
            console.log('Trying direct sound play'); // Debug log
            const clickSound = new Audio("../../assets/music/sound1.mp3");
            clickSound.volume = 0.7;
            clickSound.play().then(() => {
                console.log('Direct sound play successful'); // Debug log
            }).catch(e => {
                console.log('Direct sound play failed:', e); // Debug log
            });
        } catch (e) {
            console.log('Direct sound creation failed:', e); // Debug log
        }
    };
    
    // Try immediately
    if (!tryPlaySound()) {
        console.log('First attempt failed, retrying...'); // Debug log
        // If failed, try again after short delays
        setTimeout(() => {
            if (!tryPlaySound()) {
                console.log('Second attempt failed, trying direct sound...'); // Debug log
                playDirectSound();
                setTimeout(() => {
                    tryPlaySound();
                }, 200);
            }
        }, 50);
    }
}

homebtn.addEventListener("click", () => {
    console.log('Home button clicked'); // Debug log
    if (window.gameEndMusicControl) {
        window.gameEndMusicControl.playClickSoundAndResumeMusic();
    } else {
        playClickSound();
    }
    homebtn.style.opacity = '0.6';
    setTimeout(() => {
        navigateWithLoader("../home_page/home.html");
    }, 150);
});

retrybtn.addEventListener("click", () => {
    console.log('Next button clicked'); // Debug log
    console.log('retrybtn element:', retrybtn); // Debug log
    if (window.gameEndMusicControl) {
        window.gameEndMusicControl.playClickSoundAndResumeMusic();
    } else {
        playClickSound();
    }
    retrybtn.style.opacity = '0.6';
    setTimeout(() => {
        let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
        if (unlockedLevel < 4) {
            localStorage.setItem('unlockedLevel', 4);
        }
        navigateWithLoader("../level_page/levels1-10.html");
    }, 150);
});

// Ensure music manager is initialized
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking music managers...'); // Debug log
    
    // Re-attach closeBtn event listener to ensure it works
    const closeBtnCheck = document.querySelector(".close-btn");
    console.log('DOM loaded - closeBtn found:', closeBtnCheck);
    
    if (closeBtnCheck) {
        // Remove any existing listeners and add new one
        closeBtnCheck.removeEventListener('click', arguments.callee);
        closeBtnCheck.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('DOM closeBtn clicked'); // Debug log
            playClickSound();
            closeBtnCheck.style.opacity = '0.6';
            setTimeout(() => {
                zoomOverlay.style.display='none';
                box1.src='../../assets/room3/gameplay1@3x.webp';
                closeBtnCheck.style.opacity = '1';
            }, 100);
        });
    }
    
    // Wait a bit for music managers to initialize
    setTimeout(() => {
        console.log('After timeout - seamlessMusicManager:', window.seamlessMusicManager); // Debug log
        console.log('After timeout - globalMusicManager:', window.globalMusicManager); // Debug log
        
        if (window.seamlessMusicManager) {
            console.log('seamlessMusicManager initialized:', window.seamlessMusicManager.initialized); // Debug log
        }
        if (window.globalMusicManager) {
            console.log('globalMusicManager initialized:', window.globalMusicManager.initialized); // Debug log
        }
    }, 1000);
});

