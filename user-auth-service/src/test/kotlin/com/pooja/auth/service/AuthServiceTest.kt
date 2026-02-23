package com.pooja.auth.service

import com.pooja.auth.dto.*
import com.pooja.auth.event.UserEventPublisher
import com.pooja.auth.exception.AuthException
import com.pooja.auth.model.User
import com.pooja.auth.model.UserRole
import com.pooja.auth.model.UserStatus
import com.pooja.auth.repository.UserRepository
import io.mockk.*
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.*

@ExtendWith(MockKExtension::class)
class AuthServiceTest {

    @MockK private lateinit var userRepository: UserRepository
    @MockK private lateinit var passwordEncoder: PasswordEncoder
    @MockK private lateinit var jwtService: JwtService
    @MockK private lateinit var eventPublisher: UserEventPublisher
    @InjectMockKs private lateinit var authService: AuthService

    private val testUserId = UUID.randomUUID()
    private val testUser = User(
        id = testUserId, email = "test@pooja.com", passwordHash = "hashed",
        fullName = "Test User", role = UserRole.CUSTOMER, status = UserStatus.ACTIVE
    )

    @BeforeEach
    fun setup() {
        every { eventPublisher.publishUserCreated(any()) } just Runs
        every { eventPublisher.publishUserUpdated(any()) } just Runs
        every { eventPublisher.publishUserApproved(any()) } just Runs
    }

    @Nested
    @DisplayName("register()")
    inner class Register {
        @Test
        fun `should register new customer successfully`() {
            val request = RegisterRequest(
                email = "new@pooja.com", password = "password123",
                fullName = "New User", role = UserRole.CUSTOMER
            )

            every { userRepository.existsByEmail("new@pooja.com") } returns false
            every { passwordEncoder.encode("password123") } returns "encoded_pw"
            every { userRepository.save(any()) } answers {
                firstArg<User>().apply {
                    // Simulate JPA setting the ID
                    val idField = User::class.java.getDeclaredField("id")
                    idField.isAccessible = true
                    idField.set(this, testUserId)
                }
            }
            every { jwtService.generateAccessToken(any()) } returns "access_token"
            every { jwtService.generateRefreshToken(any()) } returns "refresh_token"
            every { jwtService.getAccessTokenExpiry() } returns 3600L

            val response = authService.register(request)

            assertEquals("access_token", response.accessToken)
            assertEquals("refresh_token", response.refreshToken)
            assertEquals("New User", response.user.fullName)
            assertEquals(UserRole.CUSTOMER, response.user.role)

            verify { userRepository.existsByEmail("new@pooja.com") }
            verify { passwordEncoder.encode("password123") }
            verify { userRepository.save(any()) }
            verify { eventPublisher.publishUserCreated(any()) }
        }

        @Test
        fun `should throw when email already registered`() {
            val request = RegisterRequest(
                email = "existing@pooja.com", password = "password123", fullName = "User"
            )
            every { userRepository.existsByEmail("existing@pooja.com") } returns true

            assertThrows<AuthException> { authService.register(request) }
            verify(exactly = 0) { userRepository.save(any()) }
        }

        @Test
        fun `should set PENDING_APPROVAL status for sellers`() {
            val request = RegisterRequest(
                email = "seller@pooja.com", password = "password123",
                fullName = "Seller", role = UserRole.SELLER
            )
            every { userRepository.existsByEmail(any()) } returns false
            every { passwordEncoder.encode(any()) } returns "encoded"
            val savedUserSlot = slot<User>()
            every { userRepository.save(capture(savedUserSlot)) } answers {
                savedUserSlot.captured.apply {
                    val idField = User::class.java.getDeclaredField("id")
                    idField.isAccessible = true
                    idField.set(this, testUserId)
                }
            }
            every { jwtService.generateAccessToken(any()) } returns "tok"
            every { jwtService.generateRefreshToken(any()) } returns "ref"
            every { jwtService.getAccessTokenExpiry() } returns 3600L

            authService.register(request)

            assertEquals(UserStatus.PENDING_APPROVAL, savedUserSlot.captured.status)
        }
    }

    @Nested
    @DisplayName("login()")
    inner class Login {
        @Test
        fun `should login with valid credentials`() {
            val request = LoginRequest(email = "test@pooja.com", password = "correct_pw")

            every { userRepository.findByEmail("test@pooja.com") } returns testUser
            every { passwordEncoder.matches("correct_pw", "hashed") } returns true
            every { jwtService.generateAccessToken(testUser) } returns "access"
            every { jwtService.generateRefreshToken(testUser) } returns "refresh"
            every { jwtService.getAccessTokenExpiry() } returns 3600L

            val response = authService.login(request)

            assertEquals("access", response.accessToken)
            assertEquals("test@pooja.com", response.user.email)
        }

        @Test
        fun `should throw on invalid email`() {
            every { userRepository.findByEmail("unknown@pooja.com") } returns null

            assertThrows<AuthException> {
                authService.login(LoginRequest("unknown@pooja.com", "pw"))
            }
        }

        @Test
        fun `should throw on wrong password`() {
            every { userRepository.findByEmail("test@pooja.com") } returns testUser
            every { passwordEncoder.matches("wrong", "hashed") } returns false

            assertThrows<AuthException> {
                authService.login(LoginRequest("test@pooja.com", "wrong"))
            }
        }

        @Test
        fun `should throw for suspended account`() {
            val suspended = User(
                id = testUserId, email = "suspended@pooja.com", passwordHash = "hashed",
                fullName = "Suspended", status = UserStatus.SUSPENDED
            )
            every { userRepository.findByEmail("suspended@pooja.com") } returns suspended
            every { passwordEncoder.matches(any(), any()) } returns true

            assertThrows<AuthException> {
                authService.login(LoginRequest("suspended@pooja.com", "pw"))
            }
        }
    }

    @Nested
    @DisplayName("getProfile()")
    inner class GetProfile {
        @Test
        fun `should return user profile`() {
            every { userRepository.findById(testUserId) } returns Optional.of(testUser)

            val profile = authService.getProfile(testUserId)

            assertEquals("test@pooja.com", profile.email)
            assertEquals("Test User", profile.fullName)
        }

        @Test
        fun `should throw for non-existent user`() {
            every { userRepository.findById(any()) } returns Optional.empty()

            assertThrows<AuthException> { authService.getProfile(UUID.randomUUID()) }
        }
    }

    @Nested
    @DisplayName("updateProfile()")
    inner class UpdateProfile {
        @Test
        fun `should update profile fields`() {
            val request = UpdateProfileRequest(fullName = "Updated Name", city = "Mumbai")
            every { userRepository.findById(testUserId) } returns Optional.of(testUser)
            every { userRepository.save(any()) } answers { firstArg() }

            val result = authService.updateProfile(testUserId, request)

            assertEquals("Updated Name", result.fullName)
            assertEquals("Mumbai", result.city)
            verify { eventPublisher.publishUserUpdated(any()) }
        }
    }

    @Nested
    @DisplayName("approveUser()")
    inner class ApproveUser {
        @Test
        fun `should activate pending user`() {
            val pending = User(
                id = testUserId, email = "p@p.com", passwordHash = "h",
                fullName = "Pending", status = UserStatus.PENDING_APPROVAL
            )
            every { userRepository.findById(testUserId) } returns Optional.of(pending)
            every { userRepository.save(any()) } answers { firstArg() }

            val result = authService.approveUser(testUserId)

            assertEquals(UserStatus.ACTIVE.name, pending.status.name)
            verify { eventPublisher.publishUserApproved(any()) }
        }
    }
}
