package com.pooja.product.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.product.dto.CreateProductRequest
import com.pooja.product.dto.UpdateProductRequest
import com.pooja.product.model.Product
import com.pooja.product.model.ProductCategory
import com.pooja.product.model.ProductStatus
import com.pooja.product.repository.ProductRepository
import io.mockk.*
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.kafka.core.KafkaTemplate
import java.math.BigDecimal
import java.util.*
import java.util.concurrent.CompletableFuture

@ExtendWith(MockKExtension::class)
class ProductServiceTest {

    @MockK private lateinit var productRepository: ProductRepository
    @MockK private lateinit var kafkaTemplate: KafkaTemplate<String, String>
    @MockK private lateinit var objectMapper: ObjectMapper
    @InjectMockKs private lateinit var productService: ProductService

    private val sellerId = UUID.randomUUID()
    private val productId = UUID.randomUUID()
    private val testProduct = Product(
        id = productId, name = "Test Diya", description = "Brass diya",
        sellerId = sellerId, sellerName = "Test Seller",
        price = BigDecimal("499.00"), stock = 100,
        category = ProductCategory.DIYA_LAMPS, status = ProductStatus.ACTIVE
    )

    @BeforeEach
    fun setup() {
        every { kafkaTemplate.send(any(), any(), any()) } returns CompletableFuture.completedFuture(mockk())
        every { objectMapper.writeValueAsString(any()) } returns "{}"
    }

    @Nested
    @DisplayName("createProduct()")
    inner class Create {
        @Test
        fun `should create product with PENDING status`() {
            val request = CreateProductRequest(
                name = "New Diya", price = BigDecimal("599.00"), stock = 50,
                category = ProductCategory.DIYA_LAMPS
            )
            val savedSlot = slot<Product>()
            every { productRepository.save(capture(savedSlot)) } answers {
                savedSlot.captured.apply {
                    val f = Product::class.java.getDeclaredField("id")
                    f.isAccessible = true; f.set(this, productId)
                }
            }

            val response = productService.createProduct(sellerId, "Seller", request)

            assertEquals("New Diya", response.name)
            assertEquals(ProductStatus.PENDING_APPROVAL, response.status)
            assertEquals(sellerId, response.sellerId)
            verify { kafkaTemplate.send("product.created", any(), any()) }
        }
    }

    @Nested
    @DisplayName("updateProduct()")
    inner class Update {
        @Test
        fun `should update own product`() {
            every { productRepository.findById(productId) } returns Optional.of(testProduct)
            every { productRepository.save(any()) } answers { firstArg() }

            val request = UpdateProductRequest(name = "Updated Diya", price = BigDecimal("699.00"))
            val result = productService.updateProduct(productId, sellerId, request)

            assertEquals("Updated Diya", result.name)
            assertEquals(BigDecimal("699.00"), result.price)
        }

        @Test
        fun `should reject update from non-owner`() {
            every { productRepository.findById(productId) } returns Optional.of(testProduct)

            assertThrows<IllegalAccessException> {
                productService.updateProduct(productId, UUID.randomUUID(), UpdateProductRequest(name = "Hack"))
            }
        }

        @Test
        fun `should throw for non-existent product`() {
            every { productRepository.findById(any()) } returns Optional.empty()

            assertThrows<NoSuchElementException> {
                productService.updateProduct(productId, sellerId, UpdateProductRequest())
            }
        }
    }

    @Nested
    @DisplayName("approveProduct()")
    inner class Approve {
        @Test
        fun `should set status to ACTIVE`() {
            val pending = Product(
                id = productId, name = "Pending", sellerId = sellerId,
                price = BigDecimal("100"), category = ProductCategory.OTHER,
                status = ProductStatus.PENDING_APPROVAL
            )
            every { productRepository.findById(productId) } returns Optional.of(pending)
            every { productRepository.save(any()) } answers { firstArg() }

            val result = productService.approveProduct(productId)

            assertEquals(ProductStatus.ACTIVE, result.status)
            verify { kafkaTemplate.send("product.approved", any(), any()) }
        }
    }

    @Nested
    @DisplayName("updateStock()")
    inner class Stock {
        @Test
        fun `should decrease stock`() {
            every { productRepository.findById(productId) } returns Optional.of(testProduct)
            every { productRepository.save(any()) } answers { firstArg() }

            productService.updateStock(productId, -10)

            assertEquals(90, testProduct.stock)
        }

        @Test
        fun `should set OUT_OF_STOCK when zero`() {
            val lowStock = Product(
                id = productId, name = "Low", sellerId = sellerId,
                price = BigDecimal("100"), stock = 5, category = ProductCategory.OTHER
            )
            every { productRepository.findById(productId) } returns Optional.of(lowStock)
            every { productRepository.save(any()) } answers { firstArg() }

            productService.updateStock(productId, -5)

            assertEquals(0, lowStock.stock)
            assertEquals(ProductStatus.OUT_OF_STOCK, lowStock.status)
        }

        @Test
        fun `should not go below zero`() {
            every { productRepository.findById(productId) } returns Optional.of(testProduct)
            every { productRepository.save(any()) } answers { firstArg() }

            productService.updateStock(productId, -999)

            assertEquals(0, testProduct.stock)
        }
    }

    @Test
    fun `getPublicProducts should return active products`() {
        val page = PageImpl(listOf(testProduct))
        every { productRepository.findByStatus(ProductStatus.ACTIVE, any()) } returns page

        val result = productService.getPublicProducts(Pageable.unpaged())
        assertEquals(1, result.totalElements)
        assertEquals("Test Diya", result.content[0].name)
    }
}
