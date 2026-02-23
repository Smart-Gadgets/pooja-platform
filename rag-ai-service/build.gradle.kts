plugins {
    kotlin("plugin.spring")
}

repositories {
    maven { url = uri("https://repo.spring.io/milestone") }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
    implementation("org.springframework.kafka:spring-kafka")

    // Spring AI
    implementation("org.springframework.ai:spring-ai-openai-spring-boot-starter:1.0.0-M5")
    implementation("org.springframework.ai:spring-ai-pgvector-store-spring-boot-starter:1.0.0-M5")

    runtimeOnly("org.postgresql:postgresql")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
}
