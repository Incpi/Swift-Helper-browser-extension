@echo off

rem Remove existing zip file
del /q bin\Swift-Helper-browser-extension.zip

rem Create a new zip file
powershell Compress-Archive -Path * -DestinationPath bin\Swift-Helper-browser-extension.zip
