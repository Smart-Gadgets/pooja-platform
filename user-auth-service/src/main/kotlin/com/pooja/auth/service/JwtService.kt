package com.pooja.auth.service

import com.pooja.auth.model.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.time.Duration
import java.time.Instant
import java.util.*

@Service
class JwtService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.access-token-expiry:3600}") private val accessTokenExpiry: Long,
    @Value("\${jwt.refresh-token-expiry:604800}") private val refreshTokenExpiry: Long,
    private val redisTemplate: StringRedisTemplate
) {
    private val key by lazy { Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8)) }

    fun generateAccessToken(user: User): String {
        return Jwts.builder()
            .subject(user.id.toString())
            .claim("email", user.email)
            .claim("role", user.role.name)
            .claim("name", user.fullName)
            .issuedAt(Date.from(Instant.now()))
            .expiration(Date.from(Instant.now().plusSeconds(accessTokenExpiry)))
            .signWith(key)
            .compact()
    }

    fun generateRefreshToken(user: User): String {
        val token = UUID.randomUUID().toString()
        redisTemplate.opsForValue().set(
            "refresh:${user.id}:$token",
            user.id.toString(),
            Duration.ofSeconds(refreshTokenExpiry)
        )
        return token
    }

    fun validateAccessToken(token: String): Claims {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }

    fun validateRefreshToken(userId: UUID, token: String): Boolean {
        val stored = redisTemplate.opsForValue().get("refresh:$userId:$token")
        return stored == userId.toString()
    }

    fun revokeRefreshToken(userId: UUID, token: String) {
        redisTemplate.delete("refresh:$userId:$token")
    }

    fun getAccessTokenExpiry(): Long = accessTokenExpiry
}
