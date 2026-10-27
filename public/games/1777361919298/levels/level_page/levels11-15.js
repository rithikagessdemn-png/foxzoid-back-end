const levels = document.querySelectorAll(".level");
const homeBtnLevel = document.getElementById("homeBtnLevel");
const prevBtnLevel = document.getElementById("prevBtnLevel");
let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

// Function to play click sound
function playClickSound() {
    if (window.seamlessMusicManager) {
        window.seamlessMusicManager.playClickSound();
    } else if (window.globalMusicManager) {
        window.globalMusicManager.playClickSound();
    }
}

// Lock all levels 11-15 initially, only unlock if level 10 is completed
for (let i = 11; i <= 15; i++) {
    const levelWrapper = document.querySelector(`.level${i}`);
    if (levelWrapper) {
        if (unlockedLevel < 11 || i > unlockedLevel) {
            levelWrapper.classList.add("locked");
        } else {
            levelWrapper.classList.remove("locked");
        }
    }
}

homeBtnLevel.addEventListener("click", () => {
    playClickSound();
    setTimeout(() => {
        navigateWithLoader("../home_page/home.html");
    }, 100);
});

prevBtnLevel.addEventListener("click", () => {
    playClickSound();
    setTimeout(() => {
        navigateWithLoader("../level_page/levels1-10.html");
    }, 100);
});

levels.forEach((level) => {
    level.addEventListener("click", (e) => {
        e.stopPropagation();
        const levelNum = Number(level.dataset.level);
        
        if (unlockedLevel < 11) {
            playClickSound();
            alert('Complete Level 10 first!');
            return;
        }
        
        if (levelNum > unlockedLevel) {
            playClickSound();
            alert(`Complete Level ${levelNum - 1} first!`);
            return;
        }
        
        playClickSound();
        level.style.opacity = '0.6';
        localStorage.setItem('lastPlayedLevel', levelNum);
        
        setTimeout(() => {
            const levelPaths = {
                11: "../level11/room11.html",
                12: "../level12/room12.html",
                13: "../level13/room13.html",
                14: "../level14/room14.html",
                15: "../level15/room15.html"
            };
            
            navigateWithLoader(levelPaths[levelNum]);
        }, 100);
    });
});
