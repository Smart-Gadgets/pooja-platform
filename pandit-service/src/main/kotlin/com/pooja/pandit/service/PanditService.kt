package com.pooja.pandit.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.pandit.dto.*
import com.pooja.pandit.model.*
import com.pooja.pandit.repository.PanditContentRepository
import com.pooja.pandit.repository.PanditRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class PanditService(
    private val panditRepository: PanditRepository,
    private val contentRepository: PanditContentRepository,
    private val kafkaTemplate: KafkaTemplate<String, String>,
    private val objectMapper: ObjectMapper
) {
    @Transactional
    fun createProfile(userId: UUID, request: CreatePanditProfileRequest): PanditResponse {
        panditRepository.findByUserId(userId)?.let {
            throw IllegalStateException("Profile already exists")
        }
        val pandit = panditRepository.save(Pandit(
            userId = userId, name = request.name, bio = request.bio,
            profileImageUrl = request.profileImageUrl, phone = request.phone,
            specializations = request.specializations.toMutableSet(),
            languages = request.languages.toMutableSet(),
            city = request.city, state = request.state, pincode = request.pincode,
            experienceYears = request.experienceYears, baseRate = request.baseRate,
            virtualAvailable = request.virtualAvailable, inPersonAvailable = request.inPersonAvailable
        ))
        return pandit.toResponse()
    }

    @Transactional
    fun updateProfile(userId: UUID, request: UpdatePanditProfileRequest): PanditResponse {
        val pandit = panditRepository.findByUserId(userId)
            ?: throw NoSuchElementException("Pandit profile not found")
        request.name?.let { pandit.name = it }
        request.bio?.let { pandit.bio = it }
        request.profileImageUrl?.let { pandit.profileImageUrl = it }
        request.specializations?.let { pandit.specializations = it.toMutableSet() }
        request.languages?.let { pandit.languages = it.toMutableSet() }
        request.city?.let { pandit.city = it }
        request.state?.let { pandit.state = it }
        request.experienceYears?.let { pandit.experienceYears = it }
        request.baseRate?.let { pandit.baseRate = it }
        request.virtualAvailable?.let { pandit.virtualAvailable = it }
        request.inPersonAvailable?.let { pandit.inPersonAvailable = it }
        return panditRepository.save(pandit).toResponse()
    }

    fun getProfile(panditId: UUID): PanditResponse =
        panditRepository.findById(panditId).orElseThrow { NoSuchElementException("Not found") }.toResponse()

    fun getMyProfile(userId: UUID): PanditResponse =
        (panditRepository.findByUserId(userId) ?: throw NoSuchElementException("Not found")).toResponse()

    fun searchPandits(request: PanditSearchRequest, pageable: Pageable): Page<PanditResponse> =
        panditRepository.searchPandits(request.query, request.city, request.state, request.minRating, pageable)
            .map { it.toResponse() }

    fun listPublicPandits(pageable: Pageable): Page<PanditResponse> =
        panditRepository.findByStatus(PanditStatus.ACTIVE, pageable).map { it.toResponse() }

    @Transactional
    fun verifyPandit(panditId: UUID): PanditResponse {
        val pandit = panditRepository.findById(panditId).orElseThrow { NoSuchElementException("Not found") }
        pandit.verified = true
        pandit.status = PanditStatus.ACTIVE
        return panditRepository.save(pandit).toResponse()
    }

    @Transactional
    fun createContent(userId: UUID, request: CreateContentRequest): ContentResponse {
        val pandit = panditRepository.findByUserId(userId) ?: throw NoSuchElementException("Profile not found")
        val content = contentRepository.save(PanditContent(
            panditId = pandit.id!!, contentType = request.contentType,
            title = request.title, body = request.body,
            mediaUrl = request.mediaUrl, thumbnailUrl = request.thumbnailUrl,
            tags = request.tags.toMutableSet(), published = request.published
        ))
        return content.toResponse()
    }

    fun getPanditContent(panditId: UUID, pageable: Pageable): Page<ContentResponse> =
        contentRepository.findByPanditId(panditId, pageable).map { it.toResponse() }

    fun getPublicContent(pageable: Pageable): Page<ContentResponse> =
        contentRepository.findByPublishedTrue(pageable).map { it.toResponse() }

    private fun Pandit.toResponse() = PanditResponse(
        id = id!!, userId = userId, name = name, bio = bio,
        profileImageUrl = profileImageUrl, specializations = specializations,
        languages = languages, city = city, state = state,
        experienceYears = experienceYears, baseRate = baseRate,
        virtualAvailable = virtualAvailable, inPersonAvailable = inPersonAvailable,
        status = status, verified = verified,
        averageRating = averageRating, reviewCount = reviewCount,
        totalBookings = totalBookings, createdAt = createdAt
    )

    private fun PanditContent.toResponse() = ContentResponse(
        id = id!!, panditId = panditId, contentType = contentType,
        title = title, body = body, mediaUrl = mediaUrl,
        thumbnailUrl = thumbnailUrl, tags = tags,
        published = published, createdAt = createdAt
    )
}
