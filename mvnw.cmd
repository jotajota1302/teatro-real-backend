@echo off
setlocal
set MVNW_VERBOSE=false
set MVNW_REPOURL=https://repo.maven.apache.org/maven2
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

set MAVEN_PROJECTBASEDIR=%~dp0
if "%MAVEN_HOME%"=="" (
  set MVN_CMD=java -cp "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar" %WRAPPER_LAUNCHER%
) else (
  set MVN_CMD="%MAVEN_HOME%\bin\mvn"
)
%MVN_CMD% %*
endlocal
