package com.pooja.gateway.filter

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.nio.charset.StandardCharsets

@Component
class JwtAuthenticationFilter(
    @Value("\${jwt.secret}") private val jwtSecret: String
) : GlobalFilter, Ordered {

    private val openEndpoints = listOf(
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/refresh",
        "/api/v1/auth/otp",
        "/api/v1/products/public",
        "/api/v1/pandits/public",
        "/actuator"
    )

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val path = exchange.request.uri.path

        if (openEndpoints.any { path.startsWith(it) }) {
            return chain.filter(exchange)
        }

        val authHeader = exchange.request.headers.getFirst(HttpHeaders.AUTHORIZATION)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.response.statusCode = HttpStatus.UNAUTHORIZED
            return exchange.response.setComplete()
        }

        return try {
            val token = authHeader.substring(7)
            val claims = validateToken(token)
            val mutatedRequest = exchange.request.mutate()
                .header("X-User-Id", claims.subject)
                .header("X-User-Role", claims["role"] as? String ?: "CUSTOMER")
                .header("X-User-Email", claims["email"] as? String ?: "")
                .build()
            chain.filter(exchange.mutate().request(mutatedRequest).build())
        } catch (e: Exception) {
            exchange.response.statusCode = HttpStatus.UNAUTHORIZED
            exchange.response.setComplete()
        }
    }

    private fun validateToken(token: String): Claims {
        val key = Keys.hmacShaKeyFor(jwtSecret.toByteArray(StandardCharsets.UTF_8))
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }

    override fun getOrder(): Int = -1
}
