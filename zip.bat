@echo off

rem Remove existing zip file
del /q bin\Swift-Helper-browser-extension*.zip

rem Read version from manifest.json using PowerShell and save it to a temporary file
powershell -Command "(Get-Content manifest.json | ConvertFrom-Json).version" > version.tmp

rem Read version from the temporary file
set /p version=<version.tmp

rem Delete the temporary file
del /q version.tmp

rem Create a new zip file with version number appended to the filename
powershell Compress-Archive -Path * -DestinationPath "bin\Swift-Helper-browser-extension-%version%.zip"
