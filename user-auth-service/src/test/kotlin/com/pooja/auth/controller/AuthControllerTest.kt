package com.pooja.auth.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import com.pooja.auth.dto.*
import com.pooja.auth.model.UserRole
import com.pooja.auth.service.AuthService
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.get
import java.util.UUID

@WebMvcTest(AuthController::class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired private lateinit var mockMvc: MockMvc
    @Autowired private lateinit var objectMapper: ObjectMapper
    @MockkBean private lateinit var authService: AuthService

    private val userId = UUID.randomUUID()
    private val authResponse = AuthResponse(
        accessToken = "jwt-token", refreshToken = "refresh-token", expiresIn = 3600,
        user = UserResponse(userId, "test@pooja.com", null, "Test User", UserRole.CUSTOMER, "en", null, null, null)
    )

    @Test
    fun `POST register should return 201 with auth response`() {
        val request = RegisterRequest(email = "new@pooja.com", password = "password123", fullName = "New User")
        every { authService.register(any()) } returns authResponse

        mockMvc.post("/api/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.accessToken") { value("jwt-token") }
            jsonPath("$.user.email") { value("test@pooja.com") }
        }
    }

    @Test
    fun `POST login should return 200 with tokens`() {
        val request = LoginRequest(email = "test@pooja.com", password = "pw")
        every { authService.login(any()) } returns authResponse

        mockMvc.post("/api/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.accessToken") { value("jwt-token") }
            jsonPath("$.refreshToken") { value("refresh-token") }
        }
    }

    @Test
    fun `POST register with invalid email should return 400`() {
        val request = mapOf("email" to "not-an-email", "password" to "pw", "fullName" to "User")

        mockMvc.post("/api/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `GET profile should return user data`() {
        every { authService.getProfile(any()) } returns authResponse.user

        mockMvc.get("/api/v1/auth/profile") {
            header("X-User-Id", userId.toString())
        }.andExpect {
            status { isOk() }
            jsonPath("$.fullName") { value("Test User") }
        }
    }
}
