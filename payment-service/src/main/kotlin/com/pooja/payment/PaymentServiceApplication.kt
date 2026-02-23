package com.pooja.payment

import com.fasterxml.jackson.databind.ObjectMapper
import com.razorpay.Order
import com.razorpay.RazorpayClient
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.json.JSONObject
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.ResponseEntity
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@SpringBootApplication
class PaymentServiceApplication
fun main(args: Array<String>) { runApplication<PaymentServiceApplication>(*args) }

@Configuration
class RazorpayConfig(
    @Value("\${razorpay.key-id}") private val keyId: String,
    @Value("\${razorpay.key-secret}") private val keySecret: String
) {
    @Bean
    fun razorpayClient(): RazorpayClient = RazorpayClient(keyId, keySecret)
}

data class CreatePaymentRequest(
    @field:NotNull val amount: BigDecimal,
    @field:NotBlank val currency: String = "INR",
    @field:NotBlank val referenceId: String,
    @field:NotBlank val referenceType: String, // ORDER or BOOKING
    val description: String? = null
)

data class PaymentResponse(
    val razorpayOrderId: String,
    val amount: BigDecimal,
    val currency: String,
    val referenceId: String,
    val status: String
)

data class VerifyPaymentRequest(
    @field:NotBlank val razorpayOrderId: String,
    @field:NotBlank val razorpayPaymentId: String,
    @field:NotBlank val razorpaySignature: String
)

@Service
class PaymentService(
    private val razorpayClient: RazorpayClient,
    private val kafkaTemplate: KafkaTemplate<String, String>,
    private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun createPaymentOrder(request: CreatePaymentRequest): PaymentResponse {
        val orderRequest = JSONObject().apply {
            put("amount", request.amount.multiply(BigDecimal(100)).toInt()) // Razorpay expects paise
            put("currency", request.currency)
            put("receipt", request.referenceId)
            put("notes", JSONObject().apply {
                put("referenceType", request.referenceType)
                put("description", request.description ?: "")
            })
        }

        val razorpayOrder: Order = razorpayClient.orders.create(orderRequest)
        log.info("Created Razorpay order: {} for reference: {}", razorpayOrder.get<String>("id"), request.referenceId)

        return PaymentResponse(
            razorpayOrderId = razorpayOrder.get("id"),
            amount = request.amount,
            currency = request.currency,
            referenceId = request.referenceId,
            status = razorpayOrder.get("status")
        )
    }

    fun verifyPayment(request: VerifyPaymentRequest): Map<String, String> {
        try {
            val attributes = JSONObject().apply {
                put("razorpay_order_id", request.razorpayOrderId)
                put("razorpay_payment_id", request.razorpayPaymentId)
                put("razorpay_signature", request.razorpaySignature)
            }
            com.razorpay.Utils.verifyPaymentSignature(attributes, razorpayClient.toString())

            // Publish payment success event
            kafkaTemplate.send("payment.completed", objectMapper.writeValueAsString(mapOf(
                "razorpayOrderId" to request.razorpayOrderId,
                "razorpayPaymentId" to request.razorpayPaymentId,
                "status" to "COMPLETED",
                "timestamp" to System.currentTimeMillis().toString()
            )))

            log.info("Payment verified: {}", request.razorpayPaymentId)
            return mapOf("status" to "verified", "paymentId" to request.razorpayPaymentId)
        } catch (e: Exception) {
            log.error("Payment verification failed: {}", e.message)
            return mapOf("status" to "failed", "error" to (e.message ?: "Verification failed"))
        }
    }
}

@RestController
@RequestMapping("/api/v1/payments")
class PaymentController(private val paymentService: PaymentService) {

    @PostMapping("/create-order")
    fun createOrder(@RequestBody request: CreatePaymentRequest): ResponseEntity<PaymentResponse> =
        ResponseEntity.ok(paymentService.createPaymentOrder(request))

    @PostMapping("/verify")
    fun verify(@RequestBody request: VerifyPaymentRequest): ResponseEntity<Map<String, String>> =
        ResponseEntity.ok(paymentService.verifyPayment(request))
}
