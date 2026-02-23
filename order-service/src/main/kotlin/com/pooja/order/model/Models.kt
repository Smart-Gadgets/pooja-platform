package com.pooja.order.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.util.UUID

@Entity
@Table(name = "cart_items", schema = "orders")
class CartItem(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    @Column(nullable = false) var userId: UUID,
    @Column(nullable = false) var productId: UUID,
    var productName: String? = null,
    @Column(nullable = false, precision = 10, scale = 2) var unitPrice: BigDecimal,
    @Column(nullable = false) var quantity: Int = 1,
    @CreationTimestamp val createdAt: Instant? = null
)

@Entity
@Table(name = "orders", schema = "orders")
class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    @Column(nullable = false) var userId: UUID,
    @Column(nullable = false, unique = true) var orderNumber: String,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    var items: MutableList<OrderItem> = mutableListOf(),

    @Column(nullable = false, precision = 10, scale = 2) var subtotal: BigDecimal,
    @Column(precision = 10, scale = 2) var shippingCost: BigDecimal = BigDecimal.ZERO,
    @Column(precision = 10, scale = 2) var discount: BigDecimal = BigDecimal.ZERO,
    @Column(nullable = false, precision = 10, scale = 2) var total: BigDecimal,

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    var status: OrderStatus = OrderStatus.PENDING,

    var paymentId: String? = null,
    @Enumerated(EnumType.STRING)
    var paymentStatus: PaymentStatus = PaymentStatus.PENDING,

    var shippingName: String? = null,
    var shippingAddress: String? = null,
    var shippingCity: String? = null,
    var shippingState: String? = null,
    var shippingPincode: String? = null,
    var shippingPhone: String? = null,

    var trackingNumber: String? = null,
    var notes: String? = null,

    @CreationTimestamp val createdAt: Instant? = null,
    @UpdateTimestamp var updatedAt: Instant? = null
)

@Entity
@Table(name = "order_items", schema = "orders")
class OrderItem(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    @Column(nullable = false) var productId: UUID,
    var productName: String? = null,
    var sellerId: UUID? = null,
    @Column(nullable = false) var quantity: Int,
    @Column(nullable = false, precision = 10, scale = 2) var unitPrice: BigDecimal,
    @Column(nullable = false, precision = 10, scale = 2) var totalPrice: BigDecimal
)

@Entity
@Table(name = "bookings", schema = "orders")
class Booking(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    @Column(nullable = false) var userId: UUID,
    @Column(nullable = false) var panditId: UUID,
    var panditName: String? = null,
    @Column(nullable = false, unique = true) var bookingNumber: String,

    @Column(nullable = false) var poojaType: String,
    var description: String? = null,

    @Column(nullable = false) var bookingDate: LocalDate,
    var bookingTime: LocalTime? = null,
    var durationMinutes: Int? = null,

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    var mode: BookingMode = BookingMode.VIRTUAL,

    var address: String? = null,
    var city: String? = null,
    var pincode: String? = null,

    @Column(precision = 10, scale = 2) var amount: BigDecimal? = null,
    var paymentId: String? = null,
    @Enumerated(EnumType.STRING)
    var paymentStatus: PaymentStatus = PaymentStatus.PENDING,

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    var status: BookingStatus = BookingStatus.PENDING,

    var meetingLink: String? = null,
    var notes: String? = null,

    @CreationTimestamp val createdAt: Instant? = null,
    @UpdateTimestamp var updatedAt: Instant? = null
)

enum class OrderStatus { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED }
enum class PaymentStatus { PENDING, COMPLETED, FAILED, REFUNDED }
enum class BookingStatus { PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED }
enum class BookingMode { VIRTUAL, IN_PERSON }
