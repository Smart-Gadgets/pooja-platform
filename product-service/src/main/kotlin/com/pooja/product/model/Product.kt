package com.pooja.product.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "products", schema = "product")
class Product(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false)
    var name: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Column(nullable = false)
    var sellerId: UUID,

    var sellerName: String? = null,

    @Column(nullable = false, precision = 10, scale = 2)
    var price: BigDecimal,

    var compareAtPrice: BigDecimal? = null,

    @Column(nullable = false)
    var stock: Int = 0,

    var sku: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var category: ProductCategory,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_tags", schema = "product", joinColumns = [JoinColumn(name = "product_id")])
    @Column(name = "tag")
    var ritualTags: MutableSet<String> = mutableSetOf(),

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", schema = "product", joinColumns = [JoinColumn(name = "product_id")])
    @Column(name = "image_url")
    var imageUrls: MutableList<String> = mutableListOf(),

    var thumbnailUrl: String? = null,

    @Column(columnDefinition = "TEXT")
    var usageInstructions: String? = null,

    var weight: String? = null,
    var dimensions: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: ProductStatus = ProductStatus.PENDING_APPROVAL,

    var averageRating: Double = 0.0,
    var reviewCount: Int = 0,

    @Column(nullable = false)
    var featured: Boolean = false,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_languages", schema = "product", joinColumns = [JoinColumn(name = "product_id")])
    @MapKeyColumn(name = "lang")
    @Column(name = "translated_name")
    var nameTranslations: MutableMap<String, String> = mutableMapOf(),

    @CreationTimestamp
    val createdAt: Instant? = null,

    @UpdateTimestamp
    var updatedAt: Instant? = null
)

enum class ProductCategory {
    POOJA_SAMAGRI, IDOLS_MURTIS, BOOKS_SCRIPTURES, INCENSE_DHOOP,
    FLOWERS_GARLANDS, PRASAD_SWEETS, POOJA_THALI, DIYA_LAMPS,
    SACRED_THREAD, HAVAN_MATERIAL, GEMSTONES_RUDRAKSHA,
    FESTIVAL_SPECIAL, DAILY_ESSENTIALS, OTHER
}

enum class ProductStatus {
    PENDING_APPROVAL, ACTIVE, INACTIVE, OUT_OF_STOCK, REJECTED
}
