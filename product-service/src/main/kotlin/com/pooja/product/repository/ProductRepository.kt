package com.pooja.product.repository

import com.pooja.product.model.Product
import com.pooja.product.model.ProductCategory
import com.pooja.product.model.ProductStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.util.UUID

@Repository
interface ProductRepository : JpaRepository<Product, UUID> {

    fun findByStatusAndCategory(status: ProductStatus, category: ProductCategory, pageable: Pageable): Page<Product>

    fun findByStatus(status: ProductStatus, pageable: Pageable): Page<Product>

    fun findBySellerId(sellerId: UUID, pageable: Pageable): Page<Product>

    fun findBySellerIdAndStatus(sellerId: UUID, status: ProductStatus, pageable: Pageable): Page<Product>

    fun findByFeaturedTrueAndStatus(status: ProductStatus, pageable: Pageable): Page<Product>

    @Query("""
        SELECT p FROM Product p WHERE p.status = :status
        AND (:category IS NULL OR p.category = :category)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))
    """)
    fun searchProducts(
        status: ProductStatus = ProductStatus.ACTIVE,
        query: String?,
        category: ProductCategory?,
        minPrice: BigDecimal?,
        maxPrice: BigDecimal?,
        pageable: Pageable
    ): Page<Product>
}
