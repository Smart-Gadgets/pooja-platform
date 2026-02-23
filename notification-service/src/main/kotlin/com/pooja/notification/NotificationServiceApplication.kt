package com.pooja.notification

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*

@SpringBootApplication
class NotificationServiceApplication
fun main(args: Array<String>) { runApplication<NotificationServiceApplication>(*args) }

data class NotificationEvent(
    val type: String, val userId: String?, val email: String?,
    val subject: String, val message: String, val channel: String = "EMAIL"
)

@Service
class NotificationService(private val objectMapper: ObjectMapper) {
    private val log = LoggerFactory.getLogger(javaClass)

    @KafkaListener(topics = ["order.created"], groupId = "notification-service")
    fun handleOrderCreated(message: String) {
        try {
            val data = objectMapper.readValue(message, Map::class.java)
            log.info("📧 Sending order confirmation for order: {} to user: {}",
                data["orderNumber"], data["userId"])
            // In production: integrate with email/SMS/WhatsApp provider
            // E.g., SendGrid, Twilio, MSG91
        } catch (e: Exception) {
            log.error("Failed to process order notification: {}", e.message)
        }
    }

    @KafkaListener(topics = ["booking.created"], groupId = "notification-service")
    fun handleBookingCreated(message: String) {
        try {
            val data = objectMapper.readValue(message, Map::class.java)
            log.info("📧 Sending booking confirmation for booking: {} to user: {} and pandit: {}",
                data["bookingId"], data["userId"], data["panditId"])
        } catch (e: Exception) {
            log.error("Failed to process booking notification: {}", e.message)
        }
    }

    @KafkaListener(topics = ["user.approved"], groupId = "notification-service")
    fun handleUserApproved(message: String) {
        try {
            val data = objectMapper.readValue(message, Map::class.java)
            log.info("📧 Sending approval notification to: {}", data["email"])
        } catch (e: Exception) {
            log.error("Failed to process approval notification: {}", e.message)
        }
    }

    @KafkaListener(topics = ["order.status.updated", "booking.status.updated"], groupId = "notification-service")
    fun handleStatusUpdate(message: String) {
        try {
            val data = objectMapper.readValue(message, Map::class.java)
            log.info("📧 Sending status update notification: {}", data)
        } catch (e: Exception) {
            log.error("Failed to process status notification: {}", e.message)
        }
    }
}

@RestController
@RequestMapping("/api/v1/notifications")
class NotificationController {
    @GetMapping("/health")
    fun health() = mapOf("status" to "UP", "service" to "notification-service")
}
