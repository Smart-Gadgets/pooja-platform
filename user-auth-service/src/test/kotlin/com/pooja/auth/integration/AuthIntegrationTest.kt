package com.pooja.auth.integration

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.auth.dto.LoginRequest
import com.pooja.auth.dto.RegisterRequest
import com.pooja.auth.model.UserRole
import com.pooja.auth.repository.UserRepository
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.KafkaContainer
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
@org.springframework.test.context.ActiveProfiles("test")
class AuthIntegrationTest {

    companion object {
        @Container
        val postgres = PostgreSQLContainer("pgvector/pgvector:pg16")
            .withDatabaseName("pooja_test")
            .withUsername("test")
            .withPassword("test")

        @Container
        val redis = GenericContainer(DockerImageName.parse("redis:7-alpine"))
            .withExposedPorts(6379)

        @Container
        val kafka = KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"))

        @JvmStatic
        @DynamicPropertySource
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url") { postgres.jdbcUrl }
            registry.add("spring.datasource.username") { postgres.username }
            registry.add("spring.datasource.password") { postgres.password }
            registry.add("spring.data.redis.host") { redis.host }
            registry.add("spring.data.redis.port") { redis.getMappedPort(6379) }
            registry.add("spring.kafka.bootstrap-servers") { kafka.bootstrapServers }
            registry.add("jwt.secret") { "test-secret-key-must-be-at-least-256-bits-long-for-hmac-sha256-algorithm" }
        }
    }

    @Autowired private lateinit var mockMvc: MockMvc
    @Autowired private lateinit var objectMapper: ObjectMapper
    @Autowired private lateinit var userRepository: UserRepository

    @Test
    @Order(1)
    fun `should register a new user`() {
        val request = RegisterRequest(
            email = "integration@test.com", password = "test12345",
            fullName = "Integration User", role = UserRole.CUSTOMER
        )

        mockMvc.post("/api/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.accessToken") { isNotEmpty() }
            jsonPath("$.user.email") { value("integration@test.com") }
            jsonPath("$.user.role") { value("CUSTOMER") }
        }

        assertTrue(userRepository.existsByEmail("integration@test.com"))
    }

    @Test
    @Order(2)
    fun `should login with registered user`() {
        val request = LoginRequest(email = "integration@test.com", password = "test12345")

        mockMvc.post("/api/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.accessToken") { isNotEmpty() }
            jsonPath("$.refreshToken") { isNotEmpty() }
        }
    }

    @Test
    @Order(3)
    fun `should reject duplicate registration`() {
        val request = RegisterRequest(
            email = "integration@test.com", password = "test12345", fullName = "Dupe"
        )

        mockMvc.post("/api/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.error") { value("AUTH_ERROR") }
        }
    }

    @Test
    @Order(4)
    fun `should reject login with wrong password`() {
        mockMvc.post("/api/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("integration@test.com", "wrong"))
        }.andExpect {
            status { isBadRequest() }
        }
    }
}
