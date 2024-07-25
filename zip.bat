@echo off

rem Remove existing zip file
del /q "bin\*.zip"

rem Check if manifest.json exists
if not exist manifest.json (
    echo manifest.json not found!
    pause
    exit /b 1
)

rem Read name and version from manifest.json
for /f "usebackq tokens=2 delims=:" %%a in (`type manifest.json ^| findstr /C:"\"name\":" /C:"\"version\":"`) do (
    for /f "tokens=*" %%n in ("%%~a") do (
        if not defined name (
            set "name=%%~n"
        ) else (
            set "version=%%~n"
        )
    )
)

rem Remove double quotes and leading/trailing spaces from the name and version strings
set "name=%name:"=%"
set "version=%version:"=%"
set "version=%version:,=%"

rem Replace spaces with underscores in the name
set "name=%name: =_%"
set "name=%name:,=%"

rem Echo the filename
echo %name%-%version%.zip

rem Create a new zip file with name and version appended to the filename
powershell Compress-Archive -Path * -DestinationPath "bin\%name%_%version%.zip"

pause
