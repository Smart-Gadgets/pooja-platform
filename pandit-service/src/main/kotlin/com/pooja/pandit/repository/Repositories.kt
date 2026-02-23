package com.pooja.pandit.repository

import com.pooja.pandit.model.Pandit
import com.pooja.pandit.model.PanditContent
import com.pooja.pandit.model.PanditStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PanditRepository : JpaRepository<Pandit, UUID> {
    fun findByUserId(userId: UUID): Pandit?
    fun findByStatus(status: PanditStatus, pageable: Pageable): Page<Pandit>

    @Query("""
        SELECT p FROM Pandit p WHERE p.status = 'ACTIVE'
        AND (:city IS NULL OR LOWER(p.city) = LOWER(:city))
        AND (:state IS NULL OR LOWER(p.state) = LOWER(:state))
        AND (:minRating IS NULL OR p.averageRating >= :minRating)
        AND (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(p.bio) LIKE LOWER(CONCAT('%', :query, '%')))
    """)
    fun searchPandits(
        query: String?, city: String?, state: String?,
        minRating: Double?, pageable: Pageable
    ): Page<Pandit>
}

@Repository
interface PanditContentRepository : JpaRepository<PanditContent, UUID> {
    fun findByPanditId(panditId: UUID, pageable: Pageable): Page<PanditContent>
    fun findByPublishedTrue(pageable: Pageable): Page<PanditContent>
}
