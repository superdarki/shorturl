@echo off
setlocal EnableDelayedExpansion

:: Check for environment argument
set "ENVIRONMENT=%1"

:: Determine the path for runtime-env.js based on the environment
if "%ENVIRONMENT%"=="prod" (
    set "OUTPUT_PATH=runtime-env.js"
) else (
    set "OUTPUT_PATH=public\runtime-env.js"
)

:: Recreate config file
if exist "%OUTPUT_PATH%" del /F /Q "%OUTPUT_PATH%"
echo. > "%OUTPUT_PATH%"

:: Add assignment
echo window = window ^|^| {}; >> "%OUTPUT_PATH%"
echo window._env_ = { >> "%OUTPUT_PATH%"

:: Read each line in .env file
:: Each line represents key=value pairs
for /f "tokens=1,2 delims==" %%A in (.env) do (
    set "varname=%%A"
    set "varvalue=%%B"

    :: Check if the environment variable exists, otherwise use the value from .env file
    set "value=!%varname%!"
    if not defined value set "value=!varvalue!"

    :: Append configuration property to JS file
    echo   !varname!: "!value!", >> "%OUTPUT_PATH%"
)

:: Close the JS object
echo }; >> "%OUTPUT_PATH%"

:: Inform user
echo Configuration file created at "%OUTPUT_PATH%"

endlocal