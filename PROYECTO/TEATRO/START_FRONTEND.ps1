# ============================================================================
# Script para ejecutar el Frontend de Teatro Real
# Uso: .\START_FRONTEND.ps1
# ============================================================================

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "TEATRO REAL - FRONTEND (HTML5 + Bootstrap + JavaScript)" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta actual
$currentPath = Get-Location
Write-Host "[*] Ruta del proyecto: $currentPath" -ForegroundColor Green

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "index.html")) {
    Write-Host "[ERROR] index.html no encontrado en la carpeta actual" -ForegroundColor Red
    Write-Host "Por favor, ejecuta este script desde la carpeta PROYECTO/TEATRO/" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Archivos del frontend encontrados" -ForegroundColor Green
Write-Host ""

# Intentar usar Python primero
Write-Host "[*] Verificando Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "    [OK] Python detectado: $pythonVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "[*] Iniciando servidor en http://localhost:3000" -ForegroundColor Cyan
    Write-Host "[*] Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
    Write-Host ""
    python -m http.server 3000 --bind 127.0.0.1
} else {
    # Si no tiene Python, intenta con Node.js
    Write-Host "    [!] Python no detectado, intentando con Node.js..." -ForegroundColor Yellow
    
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    [OK] Node.js detectado: $nodeVersion" -ForegroundColor Green
        Write-Host ""
        
        # Verificar si http-server está instalado
        npm list -g http-server > $null 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[!] http-server no está instalado. Instalando..." -ForegroundColor Yellow
            npm install -g http-server
        }
        
        Write-Host "[*] Iniciando servidor en http://localhost:3000" -ForegroundColor Cyan
        Write-Host "[*] Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
        Write-Host ""
        http-server -p 3000
    } else {
        # Si no tiene ni Python ni Node.js
        Write-Host "[ERROR] No se encontró Python ni Node.js" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, instala uno de estos:" -ForegroundColor Yellow
        Write-Host "  • Python 3: https://www.python.org/" -ForegroundColor Yellow
        Write-Host "  • Node.js: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "O abre directamente el archivo HTML:" -ForegroundColor Yellow
        Write-Host "  Invoke-Item index.html" -ForegroundColor Cyan
        exit 1
    }
}
