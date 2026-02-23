package com.pooja.pandit.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "pandits", schema = "pandit")
class Pandit(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false, unique = true)
    var userId: UUID,

    @Column(nullable = false)
    var name: String,

    @Column(columnDefinition = "TEXT")
    var bio: String? = null,

    var profileImageUrl: String? = null,
    var phone: String? = null,
    var email: String? = null,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pandit_specializations", schema = "pandit", joinColumns = [JoinColumn(name = "pandit_id")])
    @Column(name = "specialization")
    var specializations: MutableSet<String> = mutableSetOf(),

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pandit_languages", schema = "pandit", joinColumns = [JoinColumn(name = "pandit_id")])
    @Column(name = "language")
    var languages: MutableSet<String> = mutableSetOf(),

    var city: String? = null,
    var state: String? = null,
    var pincode: String? = null,

    @Column(nullable = false)
    var experienceYears: Int = 0,

    @Column(precision = 10, scale = 2)
    var baseRate: BigDecimal? = null,

    @Column(nullable = false)
    var virtualAvailable: Boolean = true,

    @Column(nullable = false)
    var inPersonAvailable: Boolean = true,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: PanditStatus = PanditStatus.PENDING_VERIFICATION,

    @Column(nullable = false)
    var verified: Boolean = false,

    var averageRating: Double = 0.0,
    var reviewCount: Int = 0,
    var totalBookings: Int = 0,

    @CreationTimestamp
    val createdAt: Instant? = null,

    @UpdateTimestamp
    var updatedAt: Instant? = null
)

enum class PanditStatus {
    PENDING_VERIFICATION, ACTIVE, INACTIVE, SUSPENDED
}

@Entity
@Table(name = "pandit_content", schema = "pandit")
class PanditContent(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false)
    var panditId: UUID,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var contentType: ContentType,

    @Column(nullable = false)
    var title: String,

    @Column(columnDefinition = "TEXT")
    var body: String? = null,

    var mediaUrl: String? = null,
    var thumbnailUrl: String? = null,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "content_tags", schema = "pandit", joinColumns = [JoinColumn(name = "content_id")])
    @Column(name = "tag")
    var tags: MutableSet<String> = mutableSetOf(),

    @Column(nullable = false)
    var published: Boolean = false,

    @CreationTimestamp
    val createdAt: Instant? = null
)

enum class ContentType {
    BLOG, VIDEO, IMAGE_GALLERY
}
