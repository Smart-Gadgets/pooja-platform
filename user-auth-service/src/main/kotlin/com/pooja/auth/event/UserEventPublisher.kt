package com.pooja.auth.event

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.auth.model.User
import org.slf4j.LoggerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component

@Component
class UserEventPublisher(
    private val kafkaTemplate: KafkaTemplate<String, String>,
    private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun publishUserCreated(user: User) = publish("user.created", user)
    fun publishUserUpdated(user: User) = publish("user.updated", user)
    fun publishUserApproved(user: User) = publish("user.approved", user)

    private fun publish(topic: String, user: User) {
        try {
            val payload = objectMapper.writeValueAsString(
                mapOf(
                    "userId" to user.id.toString(),
                    "email" to user.email,
                    "fullName" to user.fullName,
                    "role" to user.role.name,
                    "status" to user.status.name,
                    "timestamp" to System.currentTimeMillis()
                )
            )
            kafkaTemplate.send(topic, user.id.toString(), payload)
            log.info("Published event to {}: userId={}", topic, user.id)
        } catch (e: Exception) {
            log.error("Failed to publish event to {}: {}", topic, e.message)
        }
    }
}
