# Stage 1: Build the application using Maven and Java 17
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the Spring Boot application (skipping tests for production build)
RUN mvn clean package -DskipTests

# Stage 2: Lightweight Java 17 runtime environment
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create directory for embedded H2 file database storage
RUN mkdir -p ./data

# Copy the generated Spring Boot JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Configure default port (Render provides PORT dynamically, default to 8080)
ENV PORT=8080

# Expose port 8080 by default
EXPOSE 8080

# Execute Spring Boot JAR with server.port mapped to PORT environment variable
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar --server.port=${PORT:-8080}"]
