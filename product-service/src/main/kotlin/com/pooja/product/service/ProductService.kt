package com.pooja.product.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.product.dto.*
import com.pooja.product.model.Product
import com.pooja.product.model.ProductStatus
import com.pooja.product.repository.ProductRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val kafkaTemplate: KafkaTemplate<String, String>,
    private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    fun createProduct(sellerId: UUID, sellerName: String?, request: CreateProductRequest): ProductResponse {
        val product = productRepository.save(
            Product(
                name = request.name,
                description = request.description,
                sellerId = sellerId,
                sellerName = sellerName,
                price = request.price,
                compareAtPrice = request.compareAtPrice,
                stock = request.stock,
                sku = request.sku,
                category = request.category,
                ritualTags = request.ritualTags.toMutableSet(),
                imageUrls = request.imageUrls.toMutableList(),
                thumbnailUrl = request.thumbnailUrl,
                usageInstructions = request.usageInstructions,
                weight = request.weight,
                dimensions = request.dimensions,
                nameTranslations = request.nameTranslations.toMutableMap(),
                status = ProductStatus.PENDING_APPROVAL
            )
        )
        publishEvent("product.created", product)
        return product.toResponse()
    }

    @Transactional
    fun updateProduct(productId: UUID, sellerId: UUID, request: UpdateProductRequest): ProductResponse {
        val product = productRepository.findById(productId)
            .orElseThrow { NoSuchElementException("Product not found") }

        if (product.sellerId != sellerId) {
            throw IllegalAccessException("Not authorized to update this product")
        }

        request.name?.let { product.name = it }
        request.description?.let { product.description = it }
        request.price?.let { product.price = it }
        request.compareAtPrice?.let { product.compareAtPrice = it }
        request.stock?.let { product.stock = it }
        request.category?.let { product.category = it }
        request.ritualTags?.let { product.ritualTags = it.toMutableSet() }
        request.imageUrls?.let { product.imageUrls = it.toMutableList() }
        request.thumbnailUrl?.let { product.thumbnailUrl = it }
        request.usageInstructions?.let { product.usageInstructions = it }
        request.weight?.let { product.weight = it }
        request.dimensions?.let { product.dimensions = it }
        request.nameTranslations?.let { product.nameTranslations = it.toMutableMap() }

        val updated = productRepository.save(product)
        publishEvent("product.updated", updated)
        return updated.toResponse()
    }

    fun getProduct(productId: UUID): ProductResponse {
        return productRepository.findById(productId)
            .orElseThrow { NoSuchElementException("Product not found") }
            .toResponse()
    }

    fun searchProducts(request: ProductSearchRequest, pageable: Pageable): Page<ProductResponse> {
        return productRepository.searchProducts(
            query = request.query,
            category = request.category,
            minPrice = request.minPrice,
            maxPrice = request.maxPrice,
            pageable = pageable
        ).map { it.toResponse() }
    }

    fun getSellerProducts(sellerId: UUID, pageable: Pageable): Page<ProductResponse> {
        return productRepository.findBySellerId(sellerId, pageable).map { it.toResponse() }
    }

    fun getFeaturedProducts(pageable: Pageable): Page<ProductResponse> {
        return productRepository.findByFeaturedTrueAndStatus(ProductStatus.ACTIVE, pageable)
            .map { it.toResponse() }
    }

    fun getPublicProducts(pageable: Pageable): Page<ProductResponse> {
        return productRepository.findByStatus(ProductStatus.ACTIVE, pageable).map { it.toResponse() }
    }

    @Transactional
    fun approveProduct(productId: UUID): ProductResponse {
        val product = productRepository.findById(productId)
            .orElseThrow { NoSuchElementException("Product not found") }
        product.status = ProductStatus.ACTIVE
        val updated = productRepository.save(product)
        publishEvent("product.approved", updated)
        return updated.toResponse()
    }

    @Transactional
    fun rejectProduct(productId: UUID): ProductResponse {
        val product = productRepository.findById(productId)
            .orElseThrow { NoSuchElementException("Product not found") }
        product.status = ProductStatus.REJECTED
        val updated = productRepository.save(product)
        return updated.toResponse()
    }

    @Transactional
    fun updateStock(productId: UUID, quantityChange: Int) {
        val product = productRepository.findById(productId)
            .orElseThrow { NoSuchElementException("Product not found") }
        product.stock = maxOf(0, product.stock + quantityChange)
        if (product.stock == 0) {
            product.status = ProductStatus.OUT_OF_STOCK
        }
        productRepository.save(product)
        publishEvent("product.stock.updated", product)
    }

    private fun publishEvent(topic: String, product: Product) {
        try {
            val payload = objectMapper.writeValueAsString(
                mapOf(
                    "productId" to product.id.toString(),
                    "name" to product.name,
                    "sellerId" to product.sellerId.toString(),
                    "category" to product.category.name,
                    "price" to product.price.toString(),
                    "status" to product.status.name,
                    "timestamp" to System.currentTimeMillis()
                )
            )
            kafkaTemplate.send(topic, product.id.toString(), payload)
        } catch (e: Exception) {
            log.error("Failed to publish product event: {}", e.message)
        }
    }

    private fun Product.toResponse() = ProductResponse(
        id = id!!, name = name, description = description,
        sellerId = sellerId, sellerName = sellerName,
        price = price, compareAtPrice = compareAtPrice,
        stock = stock, sku = sku, category = category,
        ritualTags = ritualTags, imageUrls = imageUrls,
        thumbnailUrl = thumbnailUrl, usageInstructions = usageInstructions,
        weight = weight, dimensions = dimensions, status = status,
        averageRating = averageRating, reviewCount = reviewCount,
        featured = featured, nameTranslations = nameTranslations,
        createdAt = createdAt, updatedAt = updatedAt
    )
}
