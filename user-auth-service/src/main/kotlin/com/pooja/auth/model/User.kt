package com.pooja.auth.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "users", schema = "auth")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(unique = true, nullable = false)
    var email: String,

    @Column(unique = true)
    var phone: String? = null,

    @Column(nullable = false)
    var passwordHash: String,

    @Column(nullable = false)
    var fullName: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: UserRole = UserRole.CUSTOMER,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: UserStatus = UserStatus.ACTIVE,

    var avatarUrl: String? = null,

    @Column(nullable = false)
    var preferredLanguage: String = "en",

    var city: String? = null,
    var state: String? = null,
    var pincode: String? = null,

    @Column(nullable = false)
    var emailVerified: Boolean = false,

    @Column(nullable = false)
    var phoneVerified: Boolean = false,

    @CreationTimestamp
    val createdAt: Instant? = null,

    @UpdateTimestamp
    var updatedAt: Instant? = null
)

enum class UserRole {
    CUSTOMER, SELLER, PANDIT, ADMIN, MANAGER
}

enum class UserStatus {
    ACTIVE, INACTIVE, SUSPENDED, PENDING_APPROVAL
}
