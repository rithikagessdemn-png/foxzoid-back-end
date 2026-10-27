const levels = document.querySelectorAll(".level");
const homeBtnLevel = document.getElementById("homeBtnLevel");
const nextBtnLevel = document.getElementById("nextBtnLevel");

let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

// Function to play click sound
function playClickSound() {
    if (window.seamlessMusicManager) {
        window.seamlessMusicManager.playClickSound();
    } else if (window.globalMusicManager) {
        window.globalMusicManager.playClickSound();
    }
}

// Lock/unlock levels on page load
for (let i = 1; i <= 10; i++) {
    const levelWrapper = document.querySelector(`.level${i}`);
    if (levelWrapper) {
        if (i > unlockedLevel) {
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

nextBtnLevel.addEventListener("click", () => {
    playClickSound();
    setTimeout(() => {
        navigateWithLoader("../level_page/levels11-15.html");
    }, 100);
});

levels.forEach((level) => {
    level.addEventListener("click", (e) => {
        e.stopPropagation();
        const levelNum = Number(level.dataset.level);
        
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
                1: "../level1/index.html",
                2: "../level2/room2.html",
                3: "../level3/index.html",
                4: "../level4/demo.html",
                5: "../level5/room5.html",
                6: "../level6/room6demo.html",
                7: "../level7/room7.html",
                8: "../level8/index.html",
                9: "../level9/room9.html",
                10: "../level10/demo.html"
            };
            
            navigateWithLoader(levelPaths[levelNum] || "../level1/index.html");
        }, 100);
    });
});
