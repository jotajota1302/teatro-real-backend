@echo off
REM ============================================
REM Teatro Real Backend - Build Script
REM Uso: build.bat [comando maven]
REM Ejemplos:
REM   build.bat install        - Compila el proyecto
REM   build.bat test           - Ejecuta tests
REM   build.bat clean install  - Limpia y compila
REM   build.bat spring-boot:run - Arranca servidor (mejor usar start.bat)
REM ============================================

REM Configurar Java 17
set JAVA_HOME=C:\Program Files\Java\jdk-17

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] No se encuentra Java 17 en: %JAVA_HOME%
    exit /b 1
)

set PATH=%JAVA_HOME%\bin;%PATH%

echo [OK] Using Java: %JAVA_HOME%
java -version
echo.

REM Ir al directorio del script
cd /d "%~dp0"

REM Ejecutar Maven usando el wrapper jar
"%JAVA_HOME%\bin\java" -Dmaven.multiModuleProjectDirectory=. -cp ".mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
