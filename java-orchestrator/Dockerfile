# FIX C-10: Multi-stage build — no pre-built JAR required on host.
# Stage 1 compiles the source; Stage 2 packages only the JRE + artifact.
# This makes docker-compose build fully self-contained in CI/CD pipelines.

# ---- Stage 1: Build ----
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

# Download dependencies first (cached layer unless pom.xml changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B --no-transfer-progress

# Compile and package
COPY src ./src
RUN mvn package -DskipTests -B --no-transfer-progress

# ---- Stage 2: Runtime (minimal JRE image) ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy only the fat JAR from the build stage
COPY --from=builder /build/target/*.jar app.jar

# Run as non-root for security
RUN addgroup -S agentflow && adduser -S agentflow -G agentflow
USER agentflow

ENTRYPOINT ["java", "-jar", "app.jar"]