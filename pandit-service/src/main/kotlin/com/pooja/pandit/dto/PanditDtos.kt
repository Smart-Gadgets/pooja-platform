package com.pooja.pandit.dto

import com.pooja.pandit.model.ContentType
import com.pooja.pandit.model.PanditStatus
import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class CreatePanditProfileRequest(
    @field:NotBlank val name: String,
    val bio: String? = null,
    val profileImageUrl: String? = null,
    val phone: String? = null,
    val specializations: Set<String> = emptySet(),
    val languages: Set<String> = setOf("Hindi"),
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null,
    val experienceYears: Int = 0,
    val baseRate: BigDecimal? = null,
    val virtualAvailable: Boolean = true,
    val inPersonAvailable: Boolean = true
)

data class UpdatePanditProfileRequest(
    val name: String? = null,
    val bio: String? = null,
    val profileImageUrl: String? = null,
    val specializations: Set<String>? = null,
    val languages: Set<String>? = null,
    val city: String? = null,
    val state: String? = null,
    val experienceYears: Int? = null,
    val baseRate: BigDecimal? = null,
    val virtualAvailable: Boolean? = null,
    val inPersonAvailable: Boolean? = null
)

data class PanditResponse(
    val id: UUID, val userId: UUID, val name: String, val bio: String?,
    val profileImageUrl: String?, val specializations: Set<String>,
    val languages: Set<String>, val city: String?, val state: String?,
    val experienceYears: Int, val baseRate: BigDecimal?,
    val virtualAvailable: Boolean, val inPersonAvailable: Boolean,
    val status: PanditStatus, val verified: Boolean,
    val averageRating: Double, val reviewCount: Int, val totalBookings: Int,
    val createdAt: Instant?
)

data class CreateContentRequest(
    val contentType: ContentType,
    @field:NotBlank val title: String,
    val body: String? = null,
    val mediaUrl: String? = null,
    val thumbnailUrl: String? = null,
    val tags: Set<String> = emptySet(),
    val published: Boolean = false
)

data class ContentResponse(
    val id: UUID, val panditId: UUID, val contentType: ContentType,
    val title: String, val body: String?, val mediaUrl: String?,
    val thumbnailUrl: String?, val tags: Set<String>,
    val published: Boolean, val createdAt: Instant?
)

data class PanditSearchRequest(
    val query: String? = null,
    val specialization: String? = null,
    val language: String? = null,
    val city: String? = null,
    val state: String? = null,
    val virtualOnly: Boolean = false,
    val minRating: Double? = null
)
