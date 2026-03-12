FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace

# Copy gradle wrapper first (essential for build)
COPY gradlew .
COPY gradle gradle/
COPY gradle.properties .
COPY settings.gradle.kts .
COPY build.gradle.kts .

# Copy service-specific files
COPY notification-service/build.gradle.kts notification-service/
COPY notification-service/src notification-service/src/

RUN chmod +x gradlew
RUN ./gradlew :notification-service:bootJar --no-daemon -Dorg.gradle.jvmargs="-Xmx512m -XX:MaxMetaspaceSize=256m"

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=build /workspace/notification-service/build/libs/*.jar app.jar
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 8087
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8087/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
