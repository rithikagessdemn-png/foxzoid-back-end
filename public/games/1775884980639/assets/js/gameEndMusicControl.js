// Game End Music Control Utility
// This utility handles stopping music when game ends and resuming when user interacts with buttons

class GameEndMusicControl {
    constructor() {
        this.musicStopped = false;
    }

    // Stop music when game ends and final panel appears
    stopMusicForGameEnd() {
        console.log('Stopping music for game end');
        this.musicStopped = true;
        
        if (window.seamlessMusicManager && window.seamlessMusicManager.initialized) {
            window.seamlessMusicManager.pauseMusic();
        } else if (window.globalMusicManager && window.globalMusicManager.initialized) {
            window.globalMusicManager.pauseMusic();
        }
    }

    // Resume music after game end interactions (button clicks)
    resumeMusicAfterGameEnd() {
        console.log('Resuming music after game end interaction');
        
        if (this.musicStopped) {
            if (window.seamlessMusicManager && window.seamlessMusicManager.initialized) {
                window.seamlessMusicManager.playMusic();
            } else if (window.globalMusicManager && window.globalMusicManager.initialized) {
                window.globalMusicManager.playMusic();
            }
            this.musicStopped = false;
        }
    }

    // Enhanced click sound function with music resume
    playClickSoundAndResumeMusic() {
        this.resumeMusicAfterGameEnd();
        this.playClickSound();
    }

    // Play click sound function
    playClickSound() {
        console.log('playClickSound called');
        
        const tryPlaySound = () => {
            if (window.seamlessMusicManager && window.seamlessMusicManager.initialized && window.seamlessMusicManager.clickSound) {
                console.log('Playing sound via seamlessMusicManager');
                window.seamlessMusicManager.playClickSound();
                return true;
            } else if (window.globalMusicManager && window.globalMusicManager.initialized && window.globalMusicManager.clickSound) {
                console.log('Playing sound via globalMusicManager');
                window.globalMusicManager.playClickSound();
                return true;
            }
            console.log('No music manager available or not initialized');
            return false;
        };
        
        const playDirectSound = () => {
            try {
                console.log('Trying direct sound play');
                const clickSound = new Audio("../../assets/music/sound1.mp3");
                clickSound.volume = 0.7;
                clickSound.play().then(() => {
                    console.log('Direct sound play successful');
                }).catch(e => {
                    console.log('Direct sound play failed:', e);
                });
            } catch (e) {
                console.log('Direct sound creation failed:', e);
            }
        };
        
        if (!tryPlaySound()) {
            console.log('First attempt failed, retrying...');
            setTimeout(() => {
                if (!tryPlaySound()) {
                    console.log('Second attempt failed, trying direct sound...');
                    playDirectSound();
                    setTimeout(() => {
                        tryPlaySound();
                    }, 200);
                }
            }, 50);
        }
    }

    // Auto-detect and add event listeners to common game end buttons
    initializeGameEndButtons() {
        // Common button selectors for different levels
        const buttonSelectors = [
            '#finalCloseBtn',      // Level 1
            '#panelCloseBtn',      // Level 2 and others
            '.homebtn',            // Level 1 home button
            '#homeBtn',            // Other levels home button
            '.nextbtn',            // Level 1 next button
            '#nextBtn',            // Other levels next button
            '.close-btn',          // Generic close button
            '.home-btn',           // Generic home button
            '.next-btn'            // Generic next button
        ];

        buttonSelectors.forEach(selector => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                if (button && !button.hasAttribute('data-music-control-added')) {
                    button.setAttribute('data-music-control-added', 'true');
                    
                    // Store original click handler if exists
                    const originalHandler = button.onclick;
                    
                    button.addEventListener('click', (e) => {
                        console.log(`Game end button clicked: ${selector}`);
                        this.playClickSoundAndResumeMusic();
                        
                        // Call original handler if it exists
                        if (originalHandler) {
                            originalHandler.call(button, e);
                        }
                    }, true); // Use capture phase to ensure our handler runs first
                }
            });
        });
    }

    // Initialize when DOM is ready
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.initializeGameEndButtons(), 100);
            });
        } else {
            setTimeout(() => this.initializeGameEndButtons(), 100);
        }
    }
}

// Create global instance
if (!window.gameEndMusicControl) {
    window.gameEndMusicControl = new GameEndMusicControl();
    window.gameEndMusicControl.init();
}

// Export functions for direct use
window.stopMusicForGameEnd = () => window.gameEndMusicControl.stopMusicForGameEnd();
window.resumeMusicAfterGameEnd = () => window.gameEndMusicControl.resumeMusicAfterGameEnd();
window.playClickSoundAndResumeMusic = () => window.gameEndMusicControl.playClickSoundAndResumeMusic();