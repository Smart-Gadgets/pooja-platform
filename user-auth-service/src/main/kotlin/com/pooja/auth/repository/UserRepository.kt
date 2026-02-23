package com.pooja.auth.repository

import com.pooja.auth.model.User
import com.pooja.auth.model.UserRole
import com.pooja.auth.model.UserStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UserRepository : JpaRepository<User, UUID> {
    fun findByEmail(email: String): User?
    fun findByPhone(phone: String): User?
    fun existsByEmail(email: String): Boolean
    fun existsByPhone(phone: String): Boolean
    fun findByRoleAndStatus(role: UserRole, status: UserStatus, pageable: Pageable): Page<User>
    fun findByRole(role: UserRole, pageable: Pageable): Page<User>
}
