package com.pooja.product.controller

import com.pooja.product.dto.*
import com.pooja.product.service.ProductService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/v1/products")
class ProductController(private val productService: ProductService) {

    // === Public endpoints ===

    @GetMapping("/public")
    fun listPublicProducts(pageable: Pageable): ResponseEntity<Page<ProductResponse>> {
        return ResponseEntity.ok(productService.getPublicProducts(pageable))
    }

    @GetMapping("/public/{id}")
    fun getProduct(@PathVariable id: UUID): ResponseEntity<ProductResponse> {
        return ResponseEntity.ok(productService.getProduct(id))
    }

    @GetMapping("/public/featured")
    fun getFeatured(pageable: Pageable): ResponseEntity<Page<ProductResponse>> {
        return ResponseEntity.ok(productService.getFeaturedProducts(pageable))
    }

    @PostMapping("/public/search")
    fun searchProducts(
        @RequestBody request: ProductSearchRequest,
        pageable: Pageable
    ): ResponseEntity<Page<ProductResponse>> {
        return ResponseEntity.ok(productService.searchProducts(request, pageable))
    }

    // === Seller endpoints ===

    @PostMapping
    fun createProduct(
        @RequestHeader("X-User-Id") userId: String,
        @RequestHeader("X-User-Role") role: String,
        @Valid @RequestBody request: CreateProductRequest
    ): ResponseEntity<ProductResponse> {
        require(role == "SELLER" || role == "ADMIN") { "Only sellers can create products" }
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(productService.createProduct(UUID.fromString(userId), null, request))
    }

    @PutMapping("/{id}")
    fun updateProduct(
        @PathVariable id: UUID,
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: UpdateProductRequest
    ): ResponseEntity<ProductResponse> {
        return ResponseEntity.ok(productService.updateProduct(id, UUID.fromString(userId), request))
    }

    @GetMapping("/seller/my-products")
    fun getSellerProducts(
        @RequestHeader("X-User-Id") userId: String,
        pageable: Pageable
    ): ResponseEntity<Page<ProductResponse>> {
        return ResponseEntity.ok(productService.getSellerProducts(UUID.fromString(userId), pageable))
    }

    // === Admin endpoints ===

    @PostMapping("/{id}/approve")
    fun approveProduct(@PathVariable id: UUID): ResponseEntity<ProductResponse> {
        return ResponseEntity.ok(productService.approveProduct(id))
    }

    @PostMapping("/{id}/reject")
    fun rejectProduct(@PathVariable id: UUID): ResponseEntity<ProductResponse> {
        return ResponseEntity.ok(productService.rejectProduct(id))
    }

    @PatchMapping("/{id}/stock")
    fun updateStock(
        @PathVariable id: UUID,
        @RequestParam quantityChange: Int
    ): ResponseEntity<Void> {
        productService.updateStock(id, quantityChange)
        return ResponseEntity.ok().build()
    }
}
