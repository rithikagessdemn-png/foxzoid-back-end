@echo off
setlocal enabledelayedexpansion

echo Adding Game End Music Control to all levels...
echo.

REM Navigate to the correct directory (from assets/music to root)
cd /d "%~dp0..\.."

REM Check if we're in the right directory
if not exist "levels" (
    echo Error: Cannot find levels directory. Make sure this script is in assets/music folder.
    pause
    exit /b 1
)

REM Check if gameEndMusicControl.js exists
if not exist "assets\js\gameEndMusicControl.js" (
    echo Error: gameEndMusicControl.js not found in assets\js\
    echo Please make sure the utility file exists before running this script.
    pause
    exit /b 1
)

REM Define the script tag to add
set "GAME_END_SCRIPT=<script src=\"../../assets/js/gameEndMusicControl.js\"></script>"

echo Step 1: Adding script tags to HTML files...
echo.

REM Process all level directories
for /d %%d in (levels\level*) do (
    echo Processing %%d...
    
    REM Find HTML files in each level directory
    for %%f in (%%d\*.html) do (
        echo   Checking %%f...
        
        REM Check if gameEndMusicControl.js is already included
        findstr /i "gameEndMusicControl.js" "%%f" >nul
        if errorlevel 1 (
            echo   Adding game end music control to %%f...
            
            REM Create temporary file
            set "TEMP_FILE=%%f.tmp"
            
            REM Process the file line by line
            (
                for /f "delims=" %%l in (%%f) do (
                    echo %%l
                    REM Check if this line contains seamlessMusic.js and add our script after it
                    echo %%l | findstr /i "seamlessMusic.js" >nul
                    if not errorlevel 1 (
                        echo !GAME_END_SCRIPT!
                    )
                )
            ) > "!TEMP_FILE!"
            
            REM Replace original file with updated content
            move "!TEMP_FILE!" "%%f" >nul
        ) else (
            echo   Game end music control already included in %%f
        )
    )
)

echo.
echo Step 2: Checking JavaScript files for implementation...
echo.

REM Check JavaScript files for implementation status
for /d %%d in (levels\level*) do (
    for %%f in (%%d\*.js) do (
        echo Checking %%f...
        
        REM Check if stopMusicForGameEnd is already implemented
        findstr /i "stopMusicForGameEnd\|gameEndMusicControl" "%%f" >nul
        if errorlevel 1 (
            echo   ⚠️  Manual update needed: Add music control calls to %%f
        ) else (
            echo   ✅ Music control already implemented in %%f
        )
    )
)

echo.
echo ========================================
echo IMPLEMENTATION SUMMARY
echo ========================================
echo.
echo ✅ Script tags added to HTML files
echo.
echo 📋 MANUAL STEPS REQUIRED:
echo.
echo 1. In each level's JavaScript file, find where the final panel appears
echo    and add this code:
echo.
echo    // Stop music when final panel appears
echo    if (window.gameEndMusicControl) {
echo        window.gameEndMusicControl.stopMusicForGameEnd();
echo    }
echo.
echo 2. For all game end buttons (close, home, next), replace:
echo    playClickSound();
echo.
echo    With:
echo    if (window.gameEndMusicControl) {
echo        window.gameEndMusicControl.playClickSoundAndResumeMusic();
echo    } else {
echo        playClickSound();
echo    }
echo.
echo 📖 See GAME_END_MUSIC_CONTROL_GUIDE.md for detailed instructions
echo.
echo Levels 1, 2, and 3 are already implemented as examples.
echo.
pause