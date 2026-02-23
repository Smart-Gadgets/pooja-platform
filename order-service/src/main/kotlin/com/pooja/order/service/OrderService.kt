package com.pooja.order.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.order.dto.*
import com.pooja.order.model.*
import com.pooja.order.repository.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.util.UUID
import java.util.concurrent.atomic.AtomicLong

@Service
class OrderService(
    private val cartItemRepository: CartItemRepository,
    private val orderRepository: OrderRepository,
    private val bookingRepository: BookingRepository,
    private val kafkaTemplate: KafkaTemplate<String, String>,
    private val objectMapper: ObjectMapper
) {
    private val orderCounter = AtomicLong(System.currentTimeMillis())

    // === Cart Operations ===
    @Transactional
    fun addToCart(userId: UUID, request: AddToCartRequest): CartItemResponse {
        val existing = cartItemRepository.findByUserIdAndProductId(userId, request.productId)
        val item = if (existing != null) {
            existing.quantity += request.quantity
            cartItemRepository.save(existing)
        } else {
            cartItemRepository.save(CartItem(
                userId = userId, productId = request.productId,
                productName = request.productName, unitPrice = request.unitPrice,
                quantity = request.quantity
            ))
        }
        return CartItemResponse(item.id!!, item.productId, item.productName, item.unitPrice, item.quantity)
    }

    fun getCart(userId: UUID): List<CartItemResponse> =
        cartItemRepository.findByUserId(userId).map {
            CartItemResponse(it.id!!, it.productId, it.productName, it.unitPrice, it.quantity)
        }

    @Transactional
    fun removeFromCart(userId: UUID, itemId: UUID) {
        val item = cartItemRepository.findById(itemId).orElseThrow { NoSuchElementException("Cart item not found") }
        if (item.userId != userId) throw IllegalAccessException("Not your cart item")
        cartItemRepository.delete(item)
    }

    @Transactional
    fun clearCart(userId: UUID) = cartItemRepository.deleteByUserId(userId)

    // === Order Operations ===
    @Transactional
    fun createOrder(userId: UUID, request: CreateOrderRequest): OrderResponse {
        val cartItems = cartItemRepository.findByUserId(userId)
        if (cartItems.isEmpty()) throw IllegalStateException("Cart is empty")

        val orderItems = cartItems.map { ci ->
            OrderItem(
                productId = ci.productId, productName = ci.productName,
                quantity = ci.quantity, unitPrice = ci.unitPrice,
                totalPrice = ci.unitPrice.multiply(BigDecimal(ci.quantity))
            )
        }.toMutableList()

        val subtotal = orderItems.sumOf { it.totalPrice }
        val shipping = if (subtotal >= BigDecimal(499)) BigDecimal.ZERO else BigDecimal(49)
        val total = subtotal.add(shipping)

        val order = orderRepository.save(Order(
            userId = userId,
            orderNumber = "ORD-${orderCounter.incrementAndGet()}",
            items = orderItems, subtotal = subtotal,
            shippingCost = shipping, total = total,
            shippingName = request.shippingName, shippingAddress = request.shippingAddress,
            shippingCity = request.shippingCity, shippingState = request.shippingState,
            shippingPincode = request.shippingPincode, shippingPhone = request.shippingPhone,
            notes = request.notes
        ))

        cartItemRepository.deleteByUserId(userId)
        publishEvent("order.created", mapOf("orderId" to order.id.toString(), "orderNumber" to order.orderNumber, "userId" to userId.toString(), "total" to total.toString()))
        return order.toResponse()
    }

    fun getOrder(orderId: UUID, userId: UUID): OrderResponse {
        val order = orderRepository.findById(orderId).orElseThrow { NoSuchElementException("Order not found") }
        if (order.userId != userId) throw IllegalAccessException("Not your order")
        return order.toResponse()
    }

    fun getUserOrders(userId: UUID, pageable: Pageable): Page<OrderResponse> =
        orderRepository.findByUserId(userId, pageable).map { it.toResponse() }

    @Transactional
    fun updateOrderStatus(orderId: UUID, status: OrderStatus): OrderResponse {
        val order = orderRepository.findById(orderId).orElseThrow { NoSuchElementException("Order not found") }
        order.status = status
        val updated = orderRepository.save(order)
        publishEvent("order.status.updated", mapOf("orderId" to orderId.toString(), "status" to status.name))
        return updated.toResponse()
    }

    // === Booking Operations ===
    @Transactional
    fun createBooking(userId: UUID, request: CreateBookingRequest): BookingResponse {
        val booking = bookingRepository.save(Booking(
            userId = userId, panditId = request.panditId, panditName = request.panditName,
            bookingNumber = "BK-${orderCounter.incrementAndGet()}",
            poojaType = request.poojaType, description = request.description,
            bookingDate = request.bookingDate, bookingTime = request.bookingTime,
            durationMinutes = request.durationMinutes, mode = request.mode,
            address = request.address, city = request.city, pincode = request.pincode,
            amount = request.amount, notes = request.notes
        ))
        publishEvent("booking.created", mapOf("bookingId" to booking.id.toString(), "panditId" to request.panditId.toString(), "userId" to userId.toString()))
        return booking.toResponse()
    }

    fun getUserBookings(userId: UUID, pageable: Pageable): Page<BookingResponse> =
        bookingRepository.findByUserId(userId, pageable).map { it.toResponse() }

    fun getPanditBookings(panditId: UUID, pageable: Pageable): Page<BookingResponse> =
        bookingRepository.findByPanditId(panditId, pageable).map { it.toResponse() }

    @Transactional
    fun updateBookingStatus(bookingId: UUID, status: BookingStatus): BookingResponse {
        val booking = bookingRepository.findById(bookingId).orElseThrow { NoSuchElementException("Booking not found") }
        booking.status = status
        val updated = bookingRepository.save(booking)
        publishEvent("booking.status.updated", mapOf("bookingId" to bookingId.toString(), "status" to status.name))
        return updated.toResponse()
    }

    private fun publishEvent(topic: String, data: Map<String, String>) {
        try {
            kafkaTemplate.send(topic, objectMapper.writeValueAsString(data.plus("timestamp" to System.currentTimeMillis().toString())))
        } catch (_: Exception) {}
    }

    private fun Order.toResponse() = OrderResponse(
        id = id!!, orderNumber = orderNumber,
        items = items.map { OrderItemResponse(it.productId, it.productName, it.quantity, it.unitPrice, it.totalPrice) },
        subtotal = subtotal, shippingCost = shippingCost, discount = discount,
        total = total, status = status, paymentStatus = paymentStatus,
        shippingName = shippingName, shippingCity = shippingCity,
        trackingNumber = trackingNumber, createdAt = createdAt
    )

    private fun Booking.toResponse() = BookingResponse(
        id = id!!, bookingNumber = bookingNumber, panditId = panditId,
        panditName = panditName, poojaType = poojaType, bookingDate = bookingDate,
        bookingTime = bookingTime, mode = mode, amount = amount,
        status = status, paymentStatus = paymentStatus,
        meetingLink = meetingLink, createdAt = createdAt
    )
}
