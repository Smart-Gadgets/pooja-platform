package com.pooja.order.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.order.dto.AddToCartRequest
import com.pooja.order.dto.CreateOrderRequest
import com.pooja.order.model.*
import com.pooja.order.repository.*
import io.mockk.*
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.kafka.core.KafkaTemplate
import java.math.BigDecimal
import java.util.*
import java.util.concurrent.CompletableFuture

@ExtendWith(MockKExtension::class)
class OrderServiceTest {

    @MockK private lateinit var cartItemRepository: CartItemRepository
    @MockK private lateinit var orderRepository: OrderRepository
    @MockK private lateinit var bookingRepository: BookingRepository
    @MockK private lateinit var kafkaTemplate: KafkaTemplate<String, String>
    @MockK private lateinit var objectMapper: ObjectMapper
    @InjectMockKs private lateinit var orderService: OrderService

    private val userId = UUID.randomUUID()
    private val productId = UUID.randomUUID()
    private val cartItemId = UUID.randomUUID()

    @BeforeEach
    fun setup() {
        every { kafkaTemplate.send(any(), any<String>()) } returns CompletableFuture.completedFuture(mockk())
        every { objectMapper.writeValueAsString(any()) } returns "{}"
    }

    @Nested
    @DisplayName("Cart operations")
    inner class Cart {
        @Test
        fun `should add new item to cart`() {
            val request = AddToCartRequest(productId = productId, productName = "Diya", unitPrice = BigDecimal("499"), quantity = 2)
            every { cartItemRepository.findByUserIdAndProductId(userId, productId) } returns null
            every { cartItemRepository.save(any()) } answers {
                firstArg<CartItem>().apply {
                    val f = CartItem::class.java.getDeclaredField("id")
                    f.isAccessible = true; f.set(this, cartItemId)
                }
            }

            val result = orderService.addToCart(userId, request)
            assertEquals(productId, result.productId)
            assertEquals(2, result.quantity)
        }

        @Test
        fun `should increment existing cart item`() {
            val existing = CartItem(id = cartItemId, userId = userId, productId = productId, unitPrice = BigDecimal("499"), quantity = 1)
            val request = AddToCartRequest(productId = productId, productName = "Diya", unitPrice = BigDecimal("499"), quantity = 3)
            every { cartItemRepository.findByUserIdAndProductId(userId, productId) } returns existing
            every { cartItemRepository.save(any()) } answers { firstArg() }

            val result = orderService.addToCart(userId, request)
            assertEquals(4, result.quantity) // 1 + 3
        }

        @Test
        fun `should remove cart item owned by user`() {
            val item = CartItem(id = cartItemId, userId = userId, productId = productId, unitPrice = BigDecimal("100"))
            every { cartItemRepository.findById(cartItemId) } returns Optional.of(item)
            every { cartItemRepository.delete(item) } just Runs

            assertDoesNotThrow { orderService.removeFromCart(userId, cartItemId) }
        }

        @Test
        fun `should reject removing other users cart item`() {
            val item = CartItem(id = cartItemId, userId = UUID.randomUUID(), productId = productId, unitPrice = BigDecimal("100"))
            every { cartItemRepository.findById(cartItemId) } returns Optional.of(item)

            assertThrows<IllegalAccessException> { orderService.removeFromCart(userId, cartItemId) }
        }
    }

    @Nested
    @DisplayName("Order creation")
    inner class Orders {
        @Test
        fun `should create order from cart items`() {
            val cartItems = listOf(
                CartItem(id = UUID.randomUUID(), userId = userId, productId = productId,
                    productName = "Diya", unitPrice = BigDecimal("499"), quantity = 2)
            )
            every { cartItemRepository.findByUserId(userId) } returns cartItems
            every { orderRepository.save(any()) } answers {
                firstArg<Order>().apply {
                    val f = Order::class.java.getDeclaredField("id")
                    f.isAccessible = true; f.set(this, UUID.randomUUID())
                }
            }
            every { cartItemRepository.deleteByUserId(userId) } just Runs

            val request = CreateOrderRequest(shippingName = "Test", shippingAddress = "123 St", shippingCity = "Mumbai", shippingState = "MH", shippingPincode = "400001", shippingPhone = "9876543210")
            val result = orderService.createOrder(userId, request)

            assertEquals(BigDecimal("998"), result.subtotal) // 499 * 2
            assertTrue(result.total > BigDecimal.ZERO)
            verify { cartItemRepository.deleteByUserId(userId) }
        }

        @Test
        fun `should apply free shipping above 499`() {
            val cartItems = listOf(
                CartItem(id = UUID.randomUUID(), userId = userId, productId = productId,
                    productName = "Kit", unitPrice = BigDecimal("500"), quantity = 1)
            )
            every { cartItemRepository.findByUserId(userId) } returns cartItems
            every { orderRepository.save(any()) } answers {
                firstArg<Order>().apply {
                    val f = Order::class.java.getDeclaredField("id")
                    f.isAccessible = true; f.set(this, UUID.randomUUID())
                }
            }
            every { cartItemRepository.deleteByUserId(userId) } just Runs

            val request = CreateOrderRequest(shippingName = "T", shippingAddress = "X", shippingCity = "M", shippingState = "S", shippingPincode = "1", shippingPhone = "9")
            val result = orderService.createOrder(userId, request)

            assertEquals(BigDecimal.ZERO, result.shippingCost)
        }

        @Test
        fun `should throw when cart is empty`() {
            every { cartItemRepository.findByUserId(userId) } returns emptyList()

            assertThrows<IllegalStateException> {
                orderService.createOrder(userId, CreateOrderRequest(
                    shippingName = "T", shippingAddress = "X", shippingCity = "M",
                    shippingState = "S", shippingPincode = "1", shippingPhone = "9"
                ))
            }
        }
    }
}
