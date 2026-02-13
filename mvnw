#!/bin/sh
# -----------------------------------------------------------------------------
# Maven Wrapper shell script for UNIX-based systems
# -----------------------------------------------------------------------------
MVNW_VERBOSE=false
MVNW_REPOURL=https://repo.maven.apache.org/maven2
WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

if [ -z "$MAVEN_HOME" ]; then
  JAVA_CMD="java"
else
  JAVA_CMD="$MAVEN_HOME/bin/java"
fi

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
"$JAVA_CMD" -cp "$BASEDIR/.mvn/wrapper/maven-wrapper.jar" $WRAPPER_LAUNCHER "$@"
