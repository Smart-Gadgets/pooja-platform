package com.pooja.product.dto

import com.pooja.product.model.ProductCategory
import com.pooja.product.model.ProductStatus
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class CreateProductRequest(
    @field:NotBlank val name: String,
    val description: String? = null,
    @field:NotNull @field:DecimalMin("0.01") val price: BigDecimal,
    val compareAtPrice: BigDecimal? = null,
    @field:Min(0) val stock: Int = 0,
    val sku: String? = null,
    @field:NotNull val category: ProductCategory,
    val ritualTags: Set<String> = emptySet(),
    val imageUrls: List<String> = emptyList(),
    val thumbnailUrl: String? = null,
    val usageInstructions: String? = null,
    val weight: String? = null,
    val dimensions: String? = null,
    val nameTranslations: Map<String, String> = emptyMap()
)

data class UpdateProductRequest(
    val name: String? = null,
    val description: String? = null,
    val price: BigDecimal? = null,
    val compareAtPrice: BigDecimal? = null,
    val stock: Int? = null,
    val category: ProductCategory? = null,
    val ritualTags: Set<String>? = null,
    val imageUrls: List<String>? = null,
    val thumbnailUrl: String? = null,
    val usageInstructions: String? = null,
    val weight: String? = null,
    val dimensions: String? = null,
    val nameTranslations: Map<String, String>? = null
)

data class ProductResponse(
    val id: UUID,
    val name: String,
    val description: String?,
    val sellerId: UUID,
    val sellerName: String?,
    val price: BigDecimal,
    val compareAtPrice: BigDecimal?,
    val stock: Int,
    val sku: String?,
    val category: ProductCategory,
    val ritualTags: Set<String>,
    val imageUrls: List<String>,
    val thumbnailUrl: String?,
    val usageInstructions: String?,
    val weight: String?,
    val dimensions: String?,
    val status: ProductStatus,
    val averageRating: Double,
    val reviewCount: Int,
    val featured: Boolean,
    val nameTranslations: Map<String, String>,
    val createdAt: Instant?,
    val updatedAt: Instant?
)

data class ProductSearchRequest(
    val query: String? = null,
    val category: ProductCategory? = null,
    val minPrice: BigDecimal? = null,
    val maxPrice: BigDecimal? = null,
    val ritualTags: List<String>? = null,
    val sellerId: UUID? = null,
    val featured: Boolean? = null,
    val sortBy: String = "createdAt",
    val sortDir: String = "desc"
)
