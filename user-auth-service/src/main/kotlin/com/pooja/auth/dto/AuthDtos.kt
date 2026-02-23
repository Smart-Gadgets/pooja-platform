package com.pooja.auth.dto

import com.pooja.auth.model.UserRole
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

data class RegisterRequest(
    @field:Email(message = "Valid email required")
    @field:NotBlank
    val email: String,

    @field:NotBlank
    @field:Size(min = 8, message = "Password must be at least 8 characters")
    val password: String,

    @field:NotBlank
    val fullName: String,

    val phone: String? = null,
    val role: UserRole = UserRole.CUSTOMER,
    val preferredLanguage: String = "en",
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null
)

data class LoginRequest(
    @field:NotBlank
    val email: String,
    @field:NotBlank
    val password: String
)

data class OtpLoginRequest(
    @field:NotBlank
    val phone: String,
    val otp: String? = null
)

data class RefreshTokenRequest(
    @field:NotBlank
    val refreshToken: String
)

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long,
    val user: UserResponse
)

data class UserResponse(
    val id: UUID,
    val email: String,
    val phone: String?,
    val fullName: String,
    val role: UserRole,
    val preferredLanguage: String,
    val avatarUrl: String?,
    val city: String?,
    val state: String?
)

data class UpdateProfileRequest(
    val fullName: String? = null,
    val phone: String? = null,
    val preferredLanguage: String? = null,
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null,
    val avatarUrl: String? = null
)
