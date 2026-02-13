@echo off
REM ============================================
REM Teatro Real Backend - Script de arranque
REM ============================================

echo.
echo ========================================
echo   Teatro Real Backend - Iniciando...
echo ========================================
echo.

REM Configurar Java 17
set JAVA_HOME=C:\dev\ENTORNO\jdk-17.0.13
set MAVEN_HOME=C:\dev\ENTORNO\apache-maven-3.9.6

REM Verificar que Java 17 existe
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] No se encuentra Java 17 en: %JAVA_HOME%
    echo.
    echo Por favor, instala Java 17 o modifica JAVA_HOME en este script.
    echo Descarga: https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)

REM Verificar que Maven existe
if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo [ERROR] No se encuentra Maven en: %MAVEN_HOME%
    echo.
    echo Por favor, instala Maven o modifica MAVEN_HOME en este script.
    pause
    exit /b 1
)

set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

echo [OK] JAVA_HOME = %JAVA_HOME%
java -version
echo.

REM Ir al directorio del script (por si se ejecuta desde otro lugar)
cd /d "%~dp0"

echo [INFO] Directorio: %CD%
echo [INFO] Arrancando Spring Boot en http://localhost:8080
echo [INFO] Swagger UI: http://localhost:8080/swagger-ui.html
echo [INFO] H2 Console: http://localhost:8080/h2-console
echo.
echo [INFO] Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

REM Ejecutar Spring Boot usando el wrapper jar directamente
"%JAVA_HOME%\bin\java" -Dmaven.multiModuleProjectDirectory=. -cp ".mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run

pause
