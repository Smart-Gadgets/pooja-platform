package com.pooja.pandit.controller

import com.pooja.pandit.dto.*
import com.pooja.pandit.service.PanditService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/v1/pandits")
class PanditController(private val panditService: PanditService) {

    @GetMapping("/public")
    fun listPublic(pageable: Pageable): ResponseEntity<Page<PanditResponse>> =
        ResponseEntity.ok(panditService.listPublicPandits(pageable))

    @GetMapping("/public/{id}")
    fun getPublicProfile(@PathVariable id: UUID): ResponseEntity<PanditResponse> =
        ResponseEntity.ok(panditService.getProfile(id))

    @PostMapping("/public/search")
    fun search(@RequestBody request: PanditSearchRequest, pageable: Pageable): ResponseEntity<Page<PanditResponse>> =
        ResponseEntity.ok(panditService.searchPandits(request, pageable))

    @GetMapping("/public/{panditId}/content")
    fun getContent(@PathVariable panditId: UUID, pageable: Pageable): ResponseEntity<Page<ContentResponse>> =
        ResponseEntity.ok(panditService.getPanditContent(panditId, pageable))

    @GetMapping("/public/content")
    fun getPublicContent(pageable: Pageable): ResponseEntity<Page<ContentResponse>> =
        ResponseEntity.ok(panditService.getPublicContent(pageable))

    @PostMapping("/profile")
    fun createProfile(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: CreatePanditProfileRequest
    ): ResponseEntity<PanditResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(panditService.createProfile(UUID.fromString(userId), request))

    @PutMapping("/profile")
    fun updateProfile(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: UpdatePanditProfileRequest
    ): ResponseEntity<PanditResponse> =
        ResponseEntity.ok(panditService.updateProfile(UUID.fromString(userId), request))

    @GetMapping("/profile/me")
    fun getMyProfile(@RequestHeader("X-User-Id") userId: String): ResponseEntity<PanditResponse> =
        ResponseEntity.ok(panditService.getMyProfile(UUID.fromString(userId)))

    @PostMapping("/content")
    fun createContent(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: CreateContentRequest
    ): ResponseEntity<ContentResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(panditService.createContent(UUID.fromString(userId), request))

    @PostMapping("/{id}/verify")
    fun verifyPandit(@PathVariable id: UUID): ResponseEntity<PanditResponse> =
        ResponseEntity.ok(panditService.verifyPandit(id))
}
