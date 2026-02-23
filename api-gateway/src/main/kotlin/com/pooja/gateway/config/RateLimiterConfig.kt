package com.pooja.gateway.config

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import reactor.core.publisher.Mono

@Configuration
class RateLimiterConfig {

    @Bean
    fun ipKeyResolver(): KeyResolver = KeyResolver { exchange ->
        Mono.just(
            exchange.request.remoteAddress?.address?.hostAddress ?: "unknown"
        )
    }
}
