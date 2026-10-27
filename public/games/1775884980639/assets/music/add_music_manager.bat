@echo off
setlocal enabledelayedexpansion

echo Adding Music Manager to all levels...
echo.

REM Navigate to the correct directory (from assets/music to root)
cd /d "%~dp0..\.."

REM Check if we're in the right directory
if not exist "levels" (
    echo Error: Cannot find levels directory. Make sure this script is in assets/music folder.
    pause
    exit /b 1
)

REM Check if music manager files exist
if not exist "assets\js\seamlessMusic.js" (
    echo Error: seamlessMusic.js not found in assets\js\
    pause
    exit /b 1
)

if not exist "assets\js\globalMusic.js" (
    echo Error: globalMusic.js not found in assets\js\
    pause
    exit /b 1
)

REM Define the script tag to add
set "MUSIC_SCRIPT=<script src=\"../../assets/js/seamlessMusic.js\"></script>"

REM Process all level directories
for /d %%d in (levels\level*) do (
    echo Processing %%d...
    
    REM Find HTML files in each level directory
    for %%f in (%%d\*.html) do (
        echo   Checking %%f...
        
        REM Check if seamlessMusic.js is already included
        findstr /i "seamlessMusic.js" "%%f" >nul
        if errorlevel 1 (
            echo   Adding music manager to %%f...
            
            REM Create temporary file
            set "TEMP_FILE=%%f.tmp"
            
            REM Process the file line by line
            (
                for /f "delims=" %%l in (%%f) do (
                    echo %%l
                    REM Check if this line contains </body> and add our script before it
                    echo %%l | findstr /i "</body>" >nul
                    if not errorlevel 1 (
                        echo !MUSIC_SCRIPT!
                    )
                )
            ) > "!TEMP_FILE!"
            
            REM Replace original file with updated content
            move "!TEMP_FILE!" "%%f" >nul
        ) else (
            echo   Music manager already included in %%f
        )
    )
)

echo.
echo Music manager has been added to all level HTML files!
echo.
echo The seamlessMusic.js script will now:
echo - Maintain music across page transitions
echo - Handle music enable/disable settings
echo - Provide click sound functionality
echo.
pause