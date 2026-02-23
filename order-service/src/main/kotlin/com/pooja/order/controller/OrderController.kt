package com.pooja.order.controller

import com.pooja.order.dto.*
import com.pooja.order.model.BookingStatus
import com.pooja.order.model.OrderStatus
import com.pooja.order.service.OrderService
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/v1")
class OrderController(private val orderService: OrderService) {

    // Cart
    @PostMapping("/cart")
    fun addToCart(@RequestHeader("X-User-Id") userId: String, @Valid @RequestBody request: AddToCartRequest) =
        ResponseEntity.status(HttpStatus.CREATED).body(orderService.addToCart(UUID.fromString(userId), request))

    @GetMapping("/cart")
    fun getCart(@RequestHeader("X-User-Id") userId: String) =
        ResponseEntity.ok(orderService.getCart(UUID.fromString(userId)))

    @DeleteMapping("/cart/{itemId}")
    fun removeFromCart(@RequestHeader("X-User-Id") userId: String, @PathVariable itemId: UUID): ResponseEntity<Void> {
        orderService.removeFromCart(UUID.fromString(userId), itemId); return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/cart")
    fun clearCart(@RequestHeader("X-User-Id") userId: String): ResponseEntity<Void> {
        orderService.clearCart(UUID.fromString(userId)); return ResponseEntity.noContent().build()
    }

    // Orders
    @PostMapping("/orders")
    fun createOrder(@RequestHeader("X-User-Id") userId: String, @Valid @RequestBody request: CreateOrderRequest) =
        ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(UUID.fromString(userId), request))

    @GetMapping("/orders/{id}")
    fun getOrder(@RequestHeader("X-User-Id") userId: String, @PathVariable id: UUID) =
        ResponseEntity.ok(orderService.getOrder(id, UUID.fromString(userId)))

    @GetMapping("/orders")
    fun getUserOrders(@RequestHeader("X-User-Id") userId: String, pageable: Pageable) =
        ResponseEntity.ok(orderService.getUserOrders(UUID.fromString(userId), pageable))

    @PatchMapping("/orders/{id}/status")
    fun updateOrderStatus(@PathVariable id: UUID, @RequestParam status: OrderStatus) =
        ResponseEntity.ok(orderService.updateOrderStatus(id, status))

    // Bookings
    @PostMapping("/bookings")
    fun createBooking(@RequestHeader("X-User-Id") userId: String, @Valid @RequestBody request: CreateBookingRequest) =
        ResponseEntity.status(HttpStatus.CREATED).body(orderService.createBooking(UUID.fromString(userId), request))

    @GetMapping("/bookings")
    fun getUserBookings(@RequestHeader("X-User-Id") userId: String, pageable: Pageable) =
        ResponseEntity.ok(orderService.getUserBookings(UUID.fromString(userId), pageable))

    @GetMapping("/bookings/pandit/{panditId}")
    fun getPanditBookings(@PathVariable panditId: UUID, pageable: Pageable) =
        ResponseEntity.ok(orderService.getPanditBookings(panditId, pageable))

    @PatchMapping("/bookings/{id}/status")
    fun updateBookingStatus(@PathVariable id: UUID, @RequestParam status: BookingStatus) =
        ResponseEntity.ok(orderService.updateBookingStatus(id, status))
}
