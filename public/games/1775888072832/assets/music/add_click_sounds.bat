@echo off
setlocal enabledelayedexpansion

echo Adding Click Sounds to all levels...
echo.

REM Navigate to the correct directory (from assets/music to root)
cd /d "%~dp0..\.."

REM Check if we're in the right directory
if not exist "levels" (
    echo Error: Cannot find levels directory. Make sure this script is in assets/music folder.
    pause
    exit /b 1
)

REM Define the click sound function to add
set "CLICK_FUNCTION=// Function to play click sound^

function playClickSound() {^

    console.log('playClickSound called');^

    console.log('seamlessMusicManager:', window.seamlessMusicManager);^

    console.log('globalMusicManager:', window.globalMusicManager);^

    ^

    const tryPlaySound = () =^> {^

        if (window.seamlessMusicManager ^&^& window.seamlessMusicManager.initialized ^&^& window.seamlessMusicManager.clickSound) {^

            console.log('Playing sound via seamlessMusicManager');^

            window.seamlessMusicManager.playClickSound();^

            return true;^

        } else if (window.globalMusicManager ^&^& window.globalMusicManager.initialized ^&^& window.globalMusicManager.clickSound) {^

            console.log('Playing sound via globalMusicManager');^

            window.globalMusicManager.playClickSound();^

            return true;^

        }^

        console.log('No music manager available or not initialized');^

        return false;^

    };^

    ^

    const playDirectSound = () =^> {^

        try {^

            console.log('Trying direct sound play');^

            const clickSound = new Audio(\"../../assets/music/sound1.mp3\");^

            clickSound.volume = 0.7;^

            clickSound.play().then(() =^> {^

                console.log('Direct sound play successful');^

            }).catch(e =^> {^

                console.log('Direct sound play failed:', e);^

            });^

        } catch (e) {^

            console.log('Direct sound creation failed:', e);^

        }^

    };^

    ^

    if (!tryPlaySound()) {^

        console.log('First attempt failed, retrying...');^

        setTimeout(() =^> {^

            if (!tryPlaySound()) {^

                console.log('Second attempt failed, trying direct sound...');^

                playDirectSound();^

                setTimeout(() =^> {^

                    tryPlaySound();^

                }, 200);^

            }^

        }, 50);^

    }^

}"

REM Process all level directories
for /d %%d in (levels\level*) do (
    echo Processing %%d...
    
    REM Find JavaScript files in each level directory
    for %%f in (%%d\*.js) do (
        echo   Checking %%f...
        
        REM Check if playClickSound function already exists
        findstr /i "function playClickSound" "%%f" >nul
        if errorlevel 1 (
            echo   Adding click sound function to %%f...
            
            REM Add the function at the end of the file
            echo. >> "%%f"
            echo !CLICK_FUNCTION! >> "%%f"
            echo. >> "%%f"
        ) else (
            echo   Click sound function already exists in %%f
        )
    )
)

echo.
echo Click sound functions have been added to all level scripts!
echo.
echo Note: You may need to manually add playClickSound() calls to button event listeners.
echo.
pause