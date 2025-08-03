FROM maven:3.8.6-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

# ✅ Official base image
FROM openjdk:17-jdk-alpine

# ✅ Metadata
LABEL maintainer="prajaktafulpagar8"

# ✅ Build arg — must match your final jar name
ARG JAR_FILE=target/employee-management-0.0.1-SNAPSHOT.jar

# ✅ Copy built jar to container
COPY ${JAR_FILE} app.jar

# ✅ Expose port 8080 for Spring Boot
EXPOSE 8080

# ✅ Run the jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
