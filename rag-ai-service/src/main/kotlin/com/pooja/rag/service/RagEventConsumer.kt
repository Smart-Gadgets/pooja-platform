package com.pooja.rag.service

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class RagEventConsumer(
    private val ragService: RagService,
    private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @KafkaListener(topics = ["product.created", "product.updated", "product.approved"], groupId = "rag-ai-service")
    fun handleProductEvent(message: String) {
        try {
            val data = objectMapper.readValue(message, Map::class.java)
            ragService.ingestProduct(
                productId = data["productId"] as? String ?: return,
                name = data["name"] as? String ?: "Unknown Product",
                description = data["description"] as? String,
                category = data["category"] as? String ?: "OTHER",
                price = data["price"] as? String ?: "0",
                tags = (data["tags"] as? List<*>)?.map { it.toString() } ?: emptyList()
            )
            log.info("Ingested product event for: {}", data["productId"])
        } catch (e: Exception) {
            log.error("Failed to process product event: {}", e.message)
        }
    }

    @KafkaListener(topics = ["user.approved"], groupId = "rag-ai-service")
    fun handlePanditApproved(message: String) {
        try {
            val data = objectMapper.readValue(message, Map::class.java)
            if (data["role"] == "PANDIT") {
                ragService.ingestPandit(
                    panditId = data["userId"] as? String ?: return,
                    name = data["fullName"] as? String ?: "Unknown Pandit",
                    bio = data["bio"] as? String,
                    specializations = (data["specializations"] as? List<*>)?.map { it.toString() } ?: emptyList(),
                    city = data["city"] as? String,
                    languages = (data["languages"] as? List<*>)?.map { it.toString() } ?: emptyList()
                )
                log.info("Ingested pandit data for: {}", data["userId"])
            }
        } catch (e: Exception) {
            log.error("Failed to process pandit event: {}", e.message)
        }
    }
}
