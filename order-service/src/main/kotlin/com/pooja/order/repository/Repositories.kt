package com.pooja.order.repository

import com.pooja.order.model.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface CartItemRepository : JpaRepository<CartItem, UUID> {
    fun findByUserId(userId: UUID): List<CartItem>
    fun findByUserIdAndProductId(userId: UUID, productId: UUID): CartItem?
    fun deleteByUserId(userId: UUID)
}

@Repository
interface OrderRepository : JpaRepository<Order, UUID> {
    fun findByUserId(userId: UUID, pageable: Pageable): Page<Order>
    fun findByOrderNumber(orderNumber: String): Order?
}

@Repository
interface BookingRepository : JpaRepository<Booking, UUID> {
    fun findByUserId(userId: UUID, pageable: Pageable): Page<Booking>
    fun findByPanditId(panditId: UUID, pageable: Pageable): Page<Booking>
    fun findByBookingNumber(bookingNumber: String): Booking?
}
