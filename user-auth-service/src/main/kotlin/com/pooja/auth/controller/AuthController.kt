package com.pooja.auth.controller

import com.pooja.auth.dto.*
import com.pooja.auth.model.UserRole
import com.pooja.auth.model.UserStatus
import com.pooja.auth.service.AuthService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request))
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(authService.login(request))
    }

    @PostMapping("/refresh")
    fun refreshToken(
        @Valid @RequestBody request: RefreshTokenRequest,
        @RequestHeader("X-User-Id") userId: String
    ): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(authService.refreshToken(request, UUID.fromString(userId)))
    }

    @GetMapping("/profile")
    fun getProfile(@RequestHeader("X-User-Id") userId: String): ResponseEntity<UserResponse> {
        return ResponseEntity.ok(authService.getProfile(UUID.fromString(userId)))
    }

    @PutMapping("/profile")
    fun updateProfile(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: UpdateProfileRequest
    ): ResponseEntity<UserResponse> {
        return ResponseEntity.ok(authService.updateProfile(UUID.fromString(userId), request))
    }

    // === Admin Endpoints ===

    @GetMapping("/users")
    fun listUsers(
        @RequestParam(required = false) role: UserRole?,
        pageable: Pageable
    ): ResponseEntity<Page<UserResponse>> {
        return ResponseEntity.ok(authService.listUsers(role, pageable))
    }

    @PostMapping("/users/{userId}/approve")
    fun approveUser(@PathVariable userId: UUID): ResponseEntity<UserResponse> {
        return ResponseEntity.ok(authService.approveUser(userId))
    }

    @PostMapping("/users/{userId}/suspend")
    fun suspendUser(@PathVariable userId: UUID): ResponseEntity<UserResponse> {
        return ResponseEntity.ok(authService.suspendUser(userId))
    }

    @PostMapping("/users/{userId}/activate")
    fun activateUser(@PathVariable userId: UUID): ResponseEntity<UserResponse> {
        return ResponseEntity.ok(authService.activateUser(userId))
    }

    @DeleteMapping("/users/{userId}")
    fun deleteUser(@PathVariable userId: UUID): ResponseEntity<Void> {
        authService.deleteUser(userId)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/users/{userId}/role")
    fun changeUserRole(
        @PathVariable userId: UUID,
        @RequestParam role: UserRole
    ): ResponseEntity<UserResponse> {
        return ResponseEntity.ok(authService.changeUserRole(userId, role))
    }
}
