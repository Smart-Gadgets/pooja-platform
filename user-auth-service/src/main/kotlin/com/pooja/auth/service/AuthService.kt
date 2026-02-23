package com.pooja.auth.service

import com.pooja.auth.dto.*
import com.pooja.auth.event.UserEventPublisher
import com.pooja.auth.exception.AuthException
import com.pooja.auth.model.User
import com.pooja.auth.model.UserRole
import com.pooja.auth.model.UserStatus
import com.pooja.auth.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val eventPublisher: UserEventPublisher
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw AuthException("Email already registered")
        }
        request.phone?.let {
            if (userRepository.existsByPhone(it)) {
                throw AuthException("Phone number already registered")
            }
        }

        val status = when (request.role) {
            UserRole.SELLER, UserRole.PANDIT -> UserStatus.PENDING_APPROVAL
            else -> UserStatus.ACTIVE
        }

        val user = userRepository.save(
            User(
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password),
                fullName = request.fullName,
                phone = request.phone,
                role = request.role,
                status = status,
                preferredLanguage = request.preferredLanguage,
                city = request.city,
                state = request.state,
                pincode = request.pincode
            )
        )

        eventPublisher.publishUserCreated(user)

        return buildAuthResponse(user)
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw AuthException("Invalid credentials")

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw AuthException("Invalid credentials")
        }

        if (user.status != UserStatus.ACTIVE) {
            throw AuthException("Account is ${user.status.name.lowercase()}. Please contact support.")
        }

        return buildAuthResponse(user)
    }

    fun refreshToken(request: RefreshTokenRequest, userId: UUID): AuthResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { AuthException("User not found") }

        if (!jwtService.validateRefreshToken(userId, request.refreshToken)) {
            throw AuthException("Invalid refresh token")
        }

        jwtService.revokeRefreshToken(userId, request.refreshToken)
        return buildAuthResponse(user)
    }

    fun getProfile(userId: UUID): UserResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { AuthException("User not found") }
        return user.toResponse()
    }

    @Transactional
    fun updateProfile(userId: UUID, request: UpdateProfileRequest): UserResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { AuthException("User not found") }

        request.fullName?.let { user.fullName = it }
        request.phone?.let { user.phone = it }
        request.preferredLanguage?.let { user.preferredLanguage = it }
        request.city?.let { user.city = it }
        request.state?.let { user.state = it }
        request.pincode?.let { user.pincode = it }
        request.avatarUrl?.let { user.avatarUrl = it }

        val updated = userRepository.save(user)
        eventPublisher.publishUserUpdated(updated)
        return updated.toResponse()
    }

    fun listUsers(role: UserRole?, pageable: Pageable): Page<UserResponse> {
        val page = if (role != null) {
            userRepository.findByRole(role, pageable)
        } else {
            userRepository.findAll(pageable)
        }
        return page.map { it.toResponse() }
    }

    @Transactional
    fun approveUser(userId: UUID): UserResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { AuthException("User not found") }
        user.status = UserStatus.ACTIVE
        val updated = userRepository.save(user)
        eventPublisher.publishUserApproved(updated)
        return updated.toResponse()
    }

    private fun buildAuthResponse(user: User): AuthResponse {
        val accessToken = jwtService.generateAccessToken(user)
        val refreshToken = jwtService.generateRefreshToken(user)
        return AuthResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            expiresIn = jwtService.getAccessTokenExpiry(),
            user = user.toResponse()
        )
    }

    private fun User.toResponse() = UserResponse(
        id = id!!,
        email = email,
        phone = phone,
        fullName = fullName,
        role = role,
        preferredLanguage = preferredLanguage,
        avatarUrl = avatarUrl,
        city = city,
        state = state
    )
}
