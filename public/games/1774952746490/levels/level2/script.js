// ==========================================
// 1. DOM ELEMENTS
// ==========================================

const bgImage = document.getElementById("bgImage");
const leaf = document.getElementById("leaf");
const floorButton = document.getElementById("floorButton");
const closeBtn = document.getElementById("closeButton");

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

// Hitboxes
const leafArea = document.getElementById("leafArea");
const buttonArea = document.getElementById("buttonArea");
const doorArea = document.getElementById("doorArea");
const slot1 = document.getElementById("slot1");
const levelPanel = document.getElementById("levelCompletePanel");

// State
let leafMoved = false;
let buttonCollected = false;


// ==========================================
// 2. OPEN LEAF LOGIC
// ==========================================

leafArea.addEventListener("click", () => {

    if (!leafMoved && !buttonCollected) {

        leaf.src = "../../assets/room2/gameplay3@3x.png";

        leaf.classList.add("moved");
        bgImage.classList.add("blur-bg");

        closeBtn.classList.remove("hidden");

        setTimeout(() => {
            if (!buttonCollected) {
                floorButton.classList.remove("hidden");
            }
        }, 200);

        leafMoved = true;

        leafArea.style.display = "none";
    }
});


// ==========================================
// 3. CLOSE LEAF LOGIC
// ==========================================

function resetLeafState() {

    leaf.src = "../../assets/room2/gameplay4@3x.png";

    leaf.classList.remove("moved");
    bgImage.classList.remove("blur-bg");

    closeBtn.classList.add("hidden");
    floorButton.classList.add("hidden");

    leafMoved = false;

    if (buttonCollected) {

        leafArea.style.pointerEvents = "none";
        leaf.style.pointerEvents = "none";

        leafArea.style.setProperty("cursor", "default", "important");
        leaf.style.setProperty("cursor", "default", "important");

        leafArea.style.display = "none";

    } else {

        leafArea.style.display = "block";
        leafArea.style.pointerEvents = "auto";
        leafArea.style.cursor = "pointer";
    }
}

// Close button
closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetLeafState();
});


// ==========================================
// 4. COLLECT BUTTON LOGIC
// ==========================================

buttonArea.addEventListener("click", () => {

    if (leafMoved && !buttonCollected) {

        console.log("Button Collected!");
        buttonCollected = true;

        const invItem = document.createElement("img");
        invItem.src = "../../assets/room2/button_3x-removebg-preview.png";
        invItem.id = "inventoryButton";
        invItem.draggable = true;

        invItem.style.width = "40px";
        invItem.style.height = "40px";

        invItem.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.id);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setDragImage(e.target, 20, 20);
        });

        slot1.appendChild(invItem);

        doorArea.classList.remove("disabled");

        buttonArea.style.display = "none";
        buttonArea.style.pointerEvents = "none";

        resetLeafState();
    }
});


// ==========================================
// 5. DROP LOGIC (WIN LEVEL)
// ==========================================

doorArea.addEventListener("dragover", (e) => {

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

});

doorArea.addEventListener("drop", (e) => {

    e.preventDefault();

    const id = e.dataTransfer.getData("text/plain");
    const item = document.getElementById(id);

    if (item && item.id === "inventoryButton") {

        item.remove();

        leaf.classList.add("hidden");
        closeBtn.classList.add("hidden");
        floorButton.classList.add("hidden");

        bgImage.src = "../../assets/room2/gameoverbg@3x.webp";
        bgImage.classList.remove("blur-bg");

        setTimeout(() => {

            if (levelPanel) {

                levelPanel.classList.remove("hidden");
                bgImage.classList.add("blur-bg");
                
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

            }

        }, 1200);
    }
});


// ==========================================
// 6. PANEL BUTTON LOGIC
// ==========================================

const panelCloseBtn = document.getElementById("panelCloseBtn");
const homeBtn = document.getElementById("homeBtn");
const nextBtn = document.getElementById("nextBtn");


// Reload level
if (panelCloseBtn) {

    panelCloseBtn.addEventListener("click", () => {

        console.log('Panel close button clicked'); // Debug log
        if (window.gameEndMusicControl) {
            window.gameEndMusicControl.playClickSoundAndResumeMusic();
        } else {
            playClickSound();
        }
        panelCloseBtn.style.opacity = '0.6';
        // Add small delay before reload to ensure sound plays
        setTimeout(() => {
            location.reload();
        }, 150);

    });

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

// Home button
if (homeBtn) {

    homeBtn.addEventListener("click", () => {

        console.log('Home button clicked'); // Debug log
        if (window.gameEndMusicControl) {
            window.gameEndMusicControl.playClickSoundAndResumeMusic();
        } else {
            playClickSound();
        }
        homeBtn.style.opacity = '0.6';
        setTimeout(() => {
            navigateWithLoader("../home_page/home.html");
        }, 150);

    });

}


// Next level
if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        console.log('Next button clicked'); // Debug log
        console.log('nextBtn element:', nextBtn); // Debug log
        if (window.gameEndMusicControl) {
            window.gameEndMusicControl.playClickSoundAndResumeMusic();
        } else {
            playClickSound();
        }
        nextBtn.style.opacity = '0.6';

        setTimeout(() => {
            let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

            if (unlockedLevel < 3) {

                localStorage.setItem('unlockedLevel', 3);

            }

            navigateWithLoader("../level_page/levels1-10.html");
        }, 150);

    });

}

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