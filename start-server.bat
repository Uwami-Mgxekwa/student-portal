@echo off
echo ========================================
echo  Starting Local Web Server
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting Python HTTP Server...
    echo.
    echo Open your browser and go to:
    echo http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python not found. Checking for Node.js...
    npx --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Starting Node.js HTTP Server...
        echo.
        echo Open your browser and go to:
        echo http://localhost:8080
        echo.
        echo Press Ctrl+C to stop the server
        echo ========================================
        npx http-server -p 8080
        goto :end
    )
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting PHP Built-in Server...
    echo.
    echo Open your browser and go to:
    echo http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    php -S localhost:8000
    goto :end
)

REM No server found
echo ========================================
echo ERROR: No web server found!
echo ========================================
echo.
echo You need to install one of these:
echo.
echo 1. Python 3: https://www.python.org/downloads/
echo 2. Node.js: https://nodejs.org/
echo 3. PHP: https://www.php.net/downloads
echo.
echo Or use VS Code with Live Server extension
echo.
pause
goto :end

:end
