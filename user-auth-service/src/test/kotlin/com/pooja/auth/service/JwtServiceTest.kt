package com.pooja.auth.service

import com.pooja.auth.model.User
import com.pooja.auth.model.UserRole
import com.pooja.auth.model.UserStatus
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.data.redis.core.ValueOperations
import java.util.UUID

class JwtServiceTest {

    private val redisTemplate = mockk<StringRedisTemplate>()
    private val valueOps = mockk<ValueOperations<String, String>>(relaxed = true)
    private val secret = "pooja-platform-test-secret-key-must-be-at-least-256-bits-long-for-hs256"

    private val jwtService = JwtService(
        secret = secret,
        accessTokenExpiry = 3600,
        refreshTokenExpiry = 604800,
        redisTemplate = redisTemplate
    )

    private val userId = UUID.randomUUID()
    private val testUser = User(
        id = userId, email = "test@test.com", passwordHash = "hash",
        fullName = "Test", role = UserRole.CUSTOMER, status = UserStatus.ACTIVE
    )

    @BeforeEach
    fun setup() {
        every { redisTemplate.opsForValue() } returns valueOps
    }

    @Test
    fun `should generate valid access token`() {
        val token = jwtService.generateAccessToken(testUser)
        assertNotNull(token)
        assertTrue(token.split(".").size == 3) // JWT has 3 parts
    }

    @Test
    fun `should validate generated access token`() {
        val token = jwtService.generateAccessToken(testUser)
        val claims = jwtService.validateAccessToken(token)

        assertEquals(userId.toString(), claims.subject)
        assertEquals("test@test.com", claims["email"])
        assertEquals("CUSTOMER", claims["role"])
        assertEquals("Test", claims["name"])
    }

    @Test
    fun `should throw on invalid token`() {
        assertThrows<Exception> {
            jwtService.validateAccessToken("invalid.token.here")
        }
    }

    @Test
    fun `should throw on tampered token`() {
        val token = jwtService.generateAccessToken(testUser)
        val tampered = token.dropLast(5) + "xxxxx"
        assertThrows<Exception> {
            jwtService.validateAccessToken(tampered)
        }
    }

    @Test
    fun `should generate refresh token and store in redis`() {
        val refreshToken = jwtService.generateRefreshToken(testUser)
        assertNotNull(refreshToken)
        assertTrue(refreshToken.isNotBlank())
        // Verify redis was called
        io.mockk.verify { valueOps.set(match { it.startsWith("refresh:") }, userId.toString(), any()) }
    }

    @Test
    fun `should validate refresh token from redis`() {
        every { valueOps.get("refresh:$userId:valid-token") } returns userId.toString()

        assertTrue(jwtService.validateRefreshToken(userId, "valid-token"))
    }

    @Test
    fun `should reject invalid refresh token`() {
        every { valueOps.get(any()) } returns null

        assertFalse(jwtService.validateRefreshToken(userId, "nonexistent"))
    }

    @Test
    fun `should revoke refresh token`() {
        every { redisTemplate.delete(any<String>()) } returns true

        jwtService.revokeRefreshToken(userId, "tok")
        io.mockk.verify { redisTemplate.delete("refresh:$userId:tok") }
    }
}
