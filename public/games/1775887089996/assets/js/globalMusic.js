// Global Music Manager
class GlobalMusicManager {
    constructor() {
        this.backgroundMusic = null;
        this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.clickSound = null;
        this.initialized = false;
        this.musicStarted = false;
    }

    init() {
        if (this.initialized) return;
        
        // Create background music
        this.backgroundMusic = new Audio("../../assets/music/music1.mpeg");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.preload = 'auto';
        
        // Create click sound
        this.clickSound = new Audio("../../assets/music/sound1.mp3");
        this.clickSound.volume = 0.7;
        this.clickSound.preload = 'auto';
        
        // Prevent music from stopping during page transitions
        this.backgroundMusic.addEventListener('ended', () => {
            if (this.musicEnabled) {
                this.backgroundMusic.play();
            }
        });
        
        // Start music if enabled and not already started globally
        if (this.musicEnabled && !this.isMusicPlaying()) {
            this.playMusic();
        }
        
        this.initialized = true;
        console.log('Global Music Manager initialized');
    }

    isMusicPlaying() {
        return this.backgroundMusic && !this.backgroundMusic.paused && this.backgroundMusic.currentTime > 0;
    }

    playMusic() {
        if (this.backgroundMusic && this.musicEnabled) {
            // Only start if not already playing
            if (!this.isMusicPlaying()) {
                this.backgroundMusic.play().catch(e => {
                    console.log('Music autoplay prevented:', e);
                    // Try again after user interaction
                    document.addEventListener('click', () => {
                        if (this.musicEnabled && !this.isMusicPlaying()) {
                            this.backgroundMusic.play().catch(err => console.log('Music play failed:', err));
                        }
                    }, { once: true });
                });
                this.musicStarted = true;
            }
        }
    }

    pauseMusic() {
        if (this.backgroundMusic && this.isMusicPlaying()) {
            this.backgroundMusic.pause();
        }
    }

    toggleMusic() {
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
            this.playClickSound(); // Play confirmation sound
        }
        
        return this.soundEnabled;
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }

    // Method to ensure music continues across page loads
    maintainMusicState() {
        if (this.musicEnabled && this.backgroundMusic) {
            // Store current time to resume from same position
            const currentTime = this.backgroundMusic.currentTime;
            localStorage.setItem('musicCurrentTime', currentTime.toString());
            
            // Resume from stored position on new page
            const storedTime = parseFloat(localStorage.getItem('musicCurrentTime') || '0');
            if (storedTime > 0 && !this.isMusicPlaying()) {
                this.backgroundMusic.currentTime = storedTime;
                this.playMusic();
            }
        }
    }
}

// Create global instance only if it doesn't exist
if (!window.globalMusicManager) {
    window.globalMusicManager = new GlobalMusicManager();
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.globalMusicManager) {
        window.globalMusicManager.init();
        window.globalMusicManager.maintainMusicState();
    }
});

// Maintain music state before page unload
window.addEventListener('beforeunload', function() {
    if (window.globalMusicManager && window.globalMusicManager.backgroundMusic) {
        const currentTime = window.globalMusicManager.backgroundMusic.currentTime;
        localStorage.setItem('musicCurrentTime', currentTime.toString());
    }
});