package com.pooja.auth.config

import com.pooja.auth.model.User
import com.pooja.auth.model.UserRole
import com.pooja.auth.model.UserStatus
import com.pooja.auth.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.core.annotation.Order
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(1)
class DataInitializer(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : ApplicationRunner {

    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    override fun run(args: ApplicationArguments?) {
        val demoUsers = listOf(
            DemoUser("admin@pooja.com", "admin123", "Platform Admin", UserRole.ADMIN, "+91-9000000001"),
            DemoUser("seller@pooja.com", "seller123", "Divine Essentials", UserRole.SELLER, "+91-9000000002",
                city = "Varanasi", state = "Uttar Pradesh"),
            DemoUser("pandit@pooja.com", "pandit123", "Pandit Ramesh Sharma", UserRole.PANDIT, "+91-9000000003",
                city = "Haridwar", state = "Uttarakhand"),
            DemoUser("customer@pooja.com", "customer123", "Priya Patel", UserRole.CUSTOMER, "+91-9000000004",
                city = "Mumbai", state = "Maharashtra"),
            DemoUser("seller2@pooja.com", "seller123", "Sacred Supplies Co.", UserRole.SELLER, "+91-9000000005",
                city = "Jaipur", state = "Rajasthan"),
            DemoUser("pandit2@pooja.com", "pandit123", "Acharya Vikram Tiwari", UserRole.PANDIT, "+91-9000000006",
                city = "Ujjain", state = "Madhya Pradesh"),
        )

        var created = 0
        var updated = 0
        for (demo in demoUsers) {
            val existing = userRepository.findByEmail(demo.email)
            if (existing == null) {
                userRepository.save(
                    User(
                        email = demo.email,
                        passwordHash = passwordEncoder.encode(demo.password),
                        fullName = demo.fullName,
                        role = demo.role,
                        status = UserStatus.ACTIVE,
                        phone = demo.phone,
                        city = demo.city,
                        state = demo.state,
                        emailVerified = true,
                        preferredLanguage = "en"
                    )
                )
                created++
                log.info("Created demo user: {} ({})", demo.email, demo.role)
            } else if (!passwordEncoder.matches(demo.password, existing.passwordHash)) {
                // User exists but password hash doesn't match — fix it
                // This handles the case where V1 migration inserted a stale/wrong BCrypt hash
                existing.passwordHash = passwordEncoder.encode(demo.password)
                existing.status = UserStatus.ACTIVE
                userRepository.save(existing)
                updated++
                log.info("Updated password for demo user: {} ({})", demo.email, demo.role)
            }
        }
        log.info("DataInitializer complete: {} created, {} updated, {} unchanged",
            created, updated, demoUsers.size - created - updated)
    }

    private data class DemoUser(
        val email: String,
        val password: String,
        val fullName: String,
        val role: UserRole,
        val phone: String? = null,
        val city: String? = null,
        val state: String? = null
    )
}
