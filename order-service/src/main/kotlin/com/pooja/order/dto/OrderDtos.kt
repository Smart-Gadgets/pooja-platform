package com.pooja.order.dto

import com.pooja.order.model.*
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.util.UUID

// === Cart ===
data class AddToCartRequest(
    @field:NotNull val productId: UUID,
    val productName: String? = null,
    @field:NotNull val unitPrice: BigDecimal,
    @field:Min(1) val quantity: Int = 1
)
data class CartItemResponse(val id: UUID, val productId: UUID, val productName: String?, val unitPrice: BigDecimal, val quantity: Int)

// === Order ===
data class CreateOrderRequest(
    @field:NotBlank val shippingName: String,
    @field:NotBlank val shippingAddress: String,
    @field:NotBlank val shippingCity: String,
    @field:NotBlank val shippingState: String,
    @field:NotBlank val shippingPincode: String,
    @field:NotBlank val shippingPhone: String,
    val notes: String? = null
)
data class OrderResponse(
    val id: UUID, val orderNumber: String, val items: List<OrderItemResponse>,
    val subtotal: BigDecimal, val shippingCost: BigDecimal, val discount: BigDecimal,
    val total: BigDecimal, val status: OrderStatus, val paymentStatus: PaymentStatus,
    val shippingName: String?, val shippingCity: String?, val trackingNumber: String?,
    val createdAt: Instant?
)
data class OrderItemResponse(val productId: UUID, val productName: String?, val quantity: Int, val unitPrice: BigDecimal, val totalPrice: BigDecimal)

// === Booking ===
data class CreateBookingRequest(
    @field:NotNull val panditId: UUID,
    val panditName: String? = null,
    @field:NotBlank val poojaType: String,
    val description: String? = null,
    @field:NotNull val bookingDate: LocalDate,
    val bookingTime: LocalTime? = null,
    val durationMinutes: Int? = null,
    val mode: BookingMode = BookingMode.VIRTUAL,
    val address: String? = null,
    val city: String? = null,
    val pincode: String? = null,
    val amount: BigDecimal? = null,
    val notes: String? = null
)
data class BookingResponse(
    val id: UUID, val bookingNumber: String, val panditId: UUID, val panditName: String?,
    val poojaType: String, val bookingDate: LocalDate, val bookingTime: LocalTime?,
    val mode: BookingMode, val amount: BigDecimal?, val status: BookingStatus,
    val paymentStatus: PaymentStatus, val meetingLink: String?, val createdAt: Instant?
)
