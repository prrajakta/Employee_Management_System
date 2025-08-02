# Use official Java runtime base image
FROM openjdk:17-jdk-alpine

# Add metadata
LABEL maintainer="YourName"

# Build argument: your JAR name
ARG JAR_FILE=target/employee-management-0.0.1-SNAPSHOT.jar

# Copy the JAR file from target to container
COPY ${JAR_FILE} app.jar

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# Command to run the JAR
ENTRYPOINT ["java", "-jar", "/app.jar"]
