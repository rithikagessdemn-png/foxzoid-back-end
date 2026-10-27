// Homepage navigation
const playBtn = document.getElementById("playBtn");
const levelsBtn = document.getElementById("levelsBtn");
const gamesBtn = document.getElementById("gamesBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPopup = document.getElementById("settings");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const soundToggle = document.getElementById("soundToggle");
const musicToggle = document.getElementById("musicToggle");

// Function to play click sound using seamless manager
function playClickSound() {
    if (window.seamlessMusicManager) {
        window.seamlessMusicManager.playClickSound();
    } else if (window.globalMusicManager) {
        window.globalMusicManager.playClickSound();
    }
}

playBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playClickSound();
    
    setTimeout(() => {
        const lastLevel = parseInt(localStorage.getItem('lastPlayedLevel')) || 1;
        const levelPaths = {
            1: "../level1/index.html",
            2: "../level2/room2.html",
            3: "../level3/index.html",
            4: "../level4/demo.html",
            5: "../level5/room5.html",
            6: "../level6/room6demo.html",
            7: "../level7/room7.html",
            8: "../level8/index.html",
            9: "../level9/room9.html",
            10: "../level10/demo.html",
            11: "../level11/room11.html",
            12: "../level12/room12.html",
            13: "../level13/room13.html",
            14: "../level14/room14.html",
            15: "../level15/room15.html"
        };
        navigateWithLoader(levelPaths[lastLevel] || "../level1/index.html");
    }, 100);
});

levelsBtn.addEventListener("click", () => {
    playClickSound();
    
    setTimeout(() => {
        const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
        navigateWithLoader(unlockedLevel >= 11 ? "../level_page/levels11-15.html" : "../level_page/levels1-10.html");
    }, 100);
});

gamesBtn.addEventListener("click", () => {
    playClickSound();
    alert("More games coming soon!");
});

settingsBtn.addEventListener("click", () => {
    playClickSound();
    settingsPopup.style.display = "flex";
});

closeSettingsBtn.addEventListener("click", () => {
    playClickSound();
    settingsPopup.style.display = "none";
});

soundToggle.addEventListener("click", function() {
    const manager = window.seamlessMusicManager || window.globalMusicManager;
    if (manager) {
        const soundEnabled = manager.toggleSound();
        
        if (soundEnabled) {
            this.src = "../../assets/home_page/panneldesign/volume_btn.webp";
            this.dataset.active = "true";
        } else {
            this.src = "../../assets/home_page/panneldesign/volume_mute_btn.webp";
            this.dataset.active = "false";
        }
    }
});

musicToggle.addEventListener("click", async function() {
    const manager = window.seamlessMusicManager || window.globalMusicManager;
    if (manager) {
        const musicEnabled = await manager.toggleMusic();
        
        if (musicEnabled) {
            this.src = "../../assets/home_page/panneldesign/volume_btn.webp";
            this.dataset.active = "true";
        } else {
            this.src = "../../assets/home_page/panneldesign/volume_mute_btn.webp";
            this.dataset.active = "false";
        }
        
        // Play click sound if sound is enabled
        playClickSound();
    }
});
