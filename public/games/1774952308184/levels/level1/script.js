const bgImage = document.getElementById("bgImage");
const carpet = document.getElementById("carpet");
const key = document.getElementById("key");
const carpetArea = document.getElementById("carpetArea");
const slot1 = document.getElementById("slot1");
const keyArea = document.getElementById("keyArea");
const doorArea = document.getElementById("doorArea");
const overlay = document.getElementById("overlay");
const finalCloseBtn= document.getElementById("finalCloseBtn");
const lastoptions = document.getElementById("lastoptions");

const homeBtn = document.querySelector(".homebtn");
const nextBtn = document.querySelector(".nextbtn");

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

// Preload other images
const preloadImages = [
  "../../assets/room1/room_1_img.webp",
  "../../assets/room1/room_back_ground_after_game_end_3x.webp"
];
preloadImages.forEach(src => {
  const img = new Image();
  img.src = src;
});



let carpetMoved = false;
let keyCollected = false;

carpetArea.addEventListener("click", () => {
    if (!carpetMoved) {
        carpet.classList.add("moved");
        carpetMoved = true;
        // Show key after carpet moves
        setTimeout(() => {
            key.classList.remove("hidden");
        });

        keyArea.classList.remove("disabled")
    }
  });

// Step 2: Collect key
keyArea.addEventListener("click", () => {
    if (keyCollected) return;
  
    keyCollected = true;
    key.classList.add("hidden");
  
    const inventoryKey = document.createElement("img");
    inventoryKey.src = "../../assets/room1/key_to_open_the_door_for_room_1.png";
    inventoryKey.style.width = "40px";
    inventoryKey.draggable = true;
    inventoryKey.id = "inventoryKey";
  
    slot1.appendChild(inventoryKey);
    bgImage.src = "../../assets/room1/room_1_img.webp"
    carpet.classList.add("hidden")
    carpetArea.classList.add("disabled")
    doorArea.classList.remove("disabled")
  });

/* START DRAG */
document.addEventListener("dragstart", (e) => {
    if (e.target.id === "inventoryKey") {
      e.dataTransfer.setData("text/plain", "inventoryKey");
    }
  });

/* ALLOW DROP */
doorArea.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

/* DROP KEY ON DOOR */
doorArea.addEventListener("drop", (e) => {
    e.preventDefault();
  
    // Open door
    bgImage.src = "../../assets/room1/room_back_ground_after_game_end_3x.webp";
  
    //Remove key from inventory
    const inventoryKey = document.getElementById("inventoryKey");
    if (inventoryKey) {
      inventoryKey.classList.add("hidden");
    }

    setTimeout(() => {
      bgImage.classList.add("blur");
      overlay.classList.remove("hidden")
      lastoptions.style.display = 'flex';
      finalCloseBtn.classList.remove("hidden")
      
      // Stop music when final panel appears
      if (window.gameEndMusicControl) {
          window.gameEndMusicControl.stopMusicForGameEnd();
      }
      
      // Show ad in inventory position after final panel appears
      setTimeout(() => {
          const panelAd = document.querySelector('.panel-ad');
          panelAd.style.display = 'block';
          panelAd.style.bottom = '10px';
          panelAd.style.height = '200px';
          panelAd.style.zIndex = '999';
          (adsbygoogle = window.adsbygoogle || []).push({});
      }, 1000);
    }, 1200)
  });

finalCloseBtn.addEventListener("click", () => {
  console.log('Final close button clicked'); // Debug log
  if (window.gameEndMusicControl) {
      window.gameEndMusicControl.playClickSoundAndResumeMusic();
  } else {
      playClickSound();
      resumeMusicAfterGameEnd();
  }
  finalCloseBtn.style.opacity = '0.6';
  // Add small delay before reload to ensure sound plays
  setTimeout(() => {
    location.reload();
  }, 150);
});

// Function to stop music when game ends
function stopMusicForGameEnd() {
    console.log('Stopping music for game end');
    if (window.seamlessMusicManager && window.seamlessMusicManager.initialized) {
        window.seamlessMusicManager.pauseMusic();
    } else if (window.globalMusicManager && window.globalMusicManager.initialized) {
        window.globalMusicManager.pauseMusic();
    }
}

// Function to resume music after game end interactions
function resumeMusicAfterGameEnd() {
    console.log('Resuming music after game end interaction');
    if (window.seamlessMusicManager && window.seamlessMusicManager.initialized) {
        window.seamlessMusicManager.playMusic();
    } else if (window.globalMusicManager && window.globalMusicManager.initialized) {
        window.globalMusicManager.playMusic();
    }
}

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

homeBtn.addEventListener("click", () => {
  console.log('Home button clicked'); // Debug log
  if (window.gameEndMusicControl) {
      window.gameEndMusicControl.playClickSoundAndResumeMusic();
  } else {
      playClickSound();
      resumeMusicAfterGameEnd();
  }
  homeBtn.style.opacity = '0.6';
  setTimeout(() => {
    navigateWithLoader("../home_page/home.html");
  }, 150);
});

nextBtn.addEventListener("click", () => {
  console.log('Next button clicked'); // Debug log
  if (window.gameEndMusicControl) {
      window.gameEndMusicControl.playClickSoundAndResumeMusic();
  } else {
      playClickSound();
      resumeMusicAfterGameEnd();
  }
  nextBtn.style.opacity = '0.6';
  let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
  if (unlockedLevel < 2) {
    localStorage.setItem('unlockedLevel', 2);
  }
  setTimeout(() => {
    navigateWithLoader("../level_page/levels1-10.html");
  }, 150);
});

// Ensure music manager is initialized
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking music managers...'); // Debug log
    
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

