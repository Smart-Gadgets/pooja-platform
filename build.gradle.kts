import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.4.1" apply false
    id("io.spring.dependency-management") version "1.1.7" apply false
    id("org.sonarqube") version "5.1.0.4882"
    id("jacoco")
    kotlin("jvm") version "2.1.0" apply false
    kotlin("plugin.spring") version "2.1.0" apply false
    kotlin("plugin.jpa") version "2.1.0" apply false
}

allprojects {
    group = "com.pooja"
    version = "1.0.0-SNAPSHOT"

    repositories {
        mavenCentral()
        maven { url = uri("https://repo.spring.io/milestone") }
    }
}

sonar {
    properties {
        property("sonar.projectKey", "pooja-platform")
        property("sonar.projectName", "Pooja Platform")
        property("sonar.host.url", System.getenv("SONAR_HOST_URL") ?: "http://localhost:9000")
        property("sonar.token", System.getenv("SONAR_TOKEN") ?: "")
        property("sonar.sourceEncoding", "UTF-8")
        property("sonar.kotlin.file.suffixes", ".kt")
        property("sonar.coverage.jacoco.xmlReportPaths",
            subprojects.map { "${it.layout.buildDirectory.get()}/reports/jacoco/test/jacocoTestReport.xml" }
                .joinToString(","))
    }
}

subprojects {
    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "org.jetbrains.kotlin.plugin.spring")
    apply(plugin = "org.springframework.boot")
    apply(plugin = "io.spring.dependency-management")
    apply(plugin = "jacoco")
    apply(plugin = "org.sonarqube")

    configure<io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension> {
        imports {
            mavenBom("org.springframework.cloud:spring-cloud-dependencies:2024.0.0")
        }
    }

    dependencies {
        "implementation"("org.jetbrains.kotlin:kotlin-reflect")
        "implementation"("org.jetbrains.kotlin:kotlin-stdlib")
        "implementation"("com.fasterxml.jackson.module:jackson-module-kotlin")
        "implementation"("org.springframework.boot:spring-boot-starter-actuator")
        "implementation"("io.micrometer:micrometer-registry-prometheus")

        // Test dependencies
        "testImplementation"("org.springframework.boot:spring-boot-starter-test") {
            exclude(group = "org.mockito")
        }
        "testImplementation"("io.mockk:mockk:1.13.13")
        "testImplementation"("com.ninja-squad:springmockk:4.0.2")
        "testImplementation"("org.testcontainers:junit-jupiter:1.20.4")
        "testImplementation"("org.testcontainers:postgresql:1.20.4")
        "testImplementation"("org.testcontainers:kafka:1.20.4")
    }

    configure<JavaPluginExtension> {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    tasks.withType<KotlinCompile> {
        compilerOptions {
            freeCompilerArgs.addAll("-Xjsr305=strict")
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
        }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
        finalizedBy(tasks.named("jacocoTestReport"))
    }

    tasks.withType<JacocoReport> {
        dependsOn(tasks.withType<Test>())
        reports {
            xml.required.set(true)
            html.required.set(true)
            csv.required.set(false)
        }
    }
}

tasks.register("jacocoMergedReport", JacocoReport::class) {
    dependsOn(subprojects.map { it.tasks.named("test") })
    additionalSourceDirs.setFrom(subprojects.flatMap {
        it.the<SourceSetContainer>()["main"].allSource.srcDirs
    })
    sourceDirectories.setFrom(subprojects.flatMap {
        it.the<SourceSetContainer>()["main"].allSource.srcDirs
    })
    classDirectories.setFrom(subprojects.flatMap {
        fileTree(it.layout.buildDirectory.dir("classes/kotlin/main"))
    })
    executionData.setFrom(subprojects.flatMap {
        fileTree(it.layout.buildDirectory) { include("jacoco/test.exec") }
    })
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
}
