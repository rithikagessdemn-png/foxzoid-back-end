// Simple Seamless Music Manager
class SeamlessMusicManager {
    constructor() {
        this.backgroundMusic = null;
        this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.clickSound = null;
        this.initialized = false;
        this.currentTime = parseFloat(localStorage.getItem('musicCurrentTime') || '0');
    }

    async init() {
        if (this.initialized) {
            // If already initialized, just ensure music is playing if enabled
            if (this.musicEnabled && this.backgroundMusic && this.backgroundMusic.paused) {
                this.resumeMusic();
            }
            return;
        }
        
        // Create background music
        this.backgroundMusic = new Audio("../../assets/music/music1.mpeg");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.preload = 'auto';
        
        // Create click sound
        this.clickSound = new Audio("../../assets/music/sound1.mp3");
        this.clickSound.volume = 0.7;
        this.clickSound.preload = 'auto';
        
        // Set up event listeners
        this.backgroundMusic.addEventListener('timeupdate', () => {
            if (!this.backgroundMusic.paused) {
                localStorage.setItem('musicCurrentTime', this.backgroundMusic.currentTime.toString());
            }
        });
        
        this.backgroundMusic.addEventListener('loadeddata', () => {
            if (this.currentTime > 0 && this.currentTime < this.backgroundMusic.duration) {
                this.backgroundMusic.currentTime = this.currentTime;
            }
        });
        
        // Start music if enabled
        if (this.musicEnabled) {
            this.resumeMusic();
        }
        
        this.initialized = true;
        console.log('Seamless Music Manager initialized');
    }

    resumeMusic() {
        if (!this.backgroundMusic || !this.musicEnabled) return;
        
        // Set the current time if we have a stored position
        if (this.currentTime > 0 && this.currentTime < this.backgroundMusic.duration) {
            this.backgroundMusic.currentTime = this.currentTime;
        }
        
        // Play the music
        this.backgroundMusic.play().catch(e => {
            console.log('Music autoplay prevented, will play on user interaction');
            this.setupUserInteractionTrigger();
        });
    }

    setupUserInteractionTrigger() {
        const playOnInteraction = () => {
            if (this.musicEnabled && this.backgroundMusic && this.backgroundMusic.paused) {
                this.backgroundMusic.play().catch(e => console.log('Music play failed'));
            }
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
    }

    playMusic() {
        if (!this.backgroundMusic || !this.musicEnabled) return;
        
        if (this.backgroundMusic.paused) {
            this.resumeMusic();
        }
    }

    pauseMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.currentTime = this.backgroundMusic.currentTime;
            localStorage.setItem('musicCurrentTime', this.currentTime.toString());
            this.backgroundMusic.pause();
        }
    }

    async toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        localStorage.setItem('musicEnabled', this.musicEnabled.toString());
        
        if (this.musicEnabled) {
            this.playMusic();
        } else {
            this.pauseMusic();
        }
        
        return this.musicEnabled;
    }

    playClickSound() {
        if (this.clickSound && this.soundEnabled) {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(e => {
                console.error('Click sound play failed:', e);
            });
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled.toString());
        
        if (this.soundEnabled) {
            this.playClickSound();
        }
        
        return this.soundEnabled;
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }

    // Save current time before page unload
    saveCurrentTime() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.currentTime = this.backgroundMusic.currentTime;
            localStorage.setItem('musicCurrentTime', this.currentTime.toString());
        }
    }

    // Force resume music (for page transitions)
    forceResume() {
        if (this.musicEnabled) {
            this.currentTime = parseFloat(localStorage.getItem('musicCurrentTime') || '0');
            this.resumeMusic();
        }
    }
}

// Create global instance only if it doesn't exist
if (!window.seamlessMusicManager) {
    window.seamlessMusicManager = new SeamlessMusicManager();
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    if (window.seamlessMusicManager) {
        await window.seamlessMusicManager.init();
    }
});

// Save music position before page unload
window.addEventListener('beforeunload', function() {
    if (window.seamlessMusicManager) {
        window.seamlessMusicManager.saveCurrentTime();
    }
});

// Handle page focus to ensure music continues
window.addEventListener('focus', function() {
    if (window.seamlessMusicManager && window.seamlessMusicManager.musicEnabled) {
        setTimeout(() => {
            window.seamlessMusicManager.forceResume();
        }, 100);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (window.seamlessMusicManager) {
        if (document.hidden) {
            window.seamlessMusicManager.saveCurrentTime();
        } else if (window.seamlessMusicManager.musicEnabled) {
            setTimeout(() => {
                window.seamlessMusicManager.forceResume();
            }, 100);
        }
    }
});