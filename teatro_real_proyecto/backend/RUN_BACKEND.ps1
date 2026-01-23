# ============================================================================
# Script para ejecutar el Backend de Teatro Real
# Uso: .\RUN_BACKEND.ps1
# ============================================================================

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "TEATRO REAL - BACKEND (Spring Boot 3.3.4 + Java 21)" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Agregar Maven al PATH
$mavenPath = "C:\ProgramData\chocolatey\lib\maven\apache-maven-3.9.11\bin"

if (-not (Test-Path $mavenPath)) {
    Write-Host "[ERROR] Maven no encontrado en: $mavenPath" -ForegroundColor Red
    Write-Host "Por favor, instala Maven usando: choco install maven" -ForegroundColor Yellow
    exit 1
}

$env:PATH += ";$mavenPath"

# Verificar Java
Write-Host "[*] Verificando Java..." -ForegroundColor Green
$javaVersion = java -version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java no esta instalado" -ForegroundColor Red
    exit 1
}
Write-Host "    [OK] Java detectado correctamente" -ForegroundColor Green

# Verificar Maven
Write-Host "[*] Verificando Maven..." -ForegroundColor Green
$mavenVersion = mvn -version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Maven no esta configurado" -ForegroundColor Red
    exit 1
}
Write-Host "    [OK] Maven 3.9.11 detectado correctamente" -ForegroundColor Green

Write-Host ""
Write-Host "[*] Descargando dependencias e inicializando..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar Spring Boot
mvn spring-boot:run -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Backend ejecutado correctamente" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ERROR] Error al ejecutar el backend" -ForegroundColor Red
    exit 1
}
