package com.pooja.pandit.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.pooja.pandit.dto.CreatePanditProfileRequest
import com.pooja.pandit.model.Pandit
import com.pooja.pandit.model.PanditStatus
import com.pooja.pandit.repository.PanditContentRepository
import com.pooja.pandit.repository.PanditRepository
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

@ExtendWith(MockKExtension::class)
class PanditServiceTest {

    @MockK private lateinit var panditRepository: PanditRepository
    @MockK private lateinit var contentRepository: PanditContentRepository
    @MockK private lateinit var kafkaTemplate: KafkaTemplate<String, String>
    @MockK private lateinit var objectMapper: ObjectMapper
    @InjectMockKs private lateinit var panditService: PanditService

    private val userId = UUID.randomUUID()
    private val panditId = UUID.randomUUID()
    private val testPandit = Pandit(
        id = panditId, userId = userId, name = "Pandit Sharma",
        bio = "Expert", city = "Varanasi", state = "UP",
        experienceYears = 20, status = PanditStatus.ACTIVE, verified = true
    )

    @Test
    fun `should create pandit profile`() {
        val request = CreatePanditProfileRequest(
            name = "New Pandit", bio = "Bio", city = "Delhi", state = "DL",
            experienceYears = 5, specializations = setOf("Ganesh Puja"),
            languages = setOf("Hindi"), baseRate = BigDecimal("1500"),
            virtualAvailable = true, inPersonAvailable = true
        )
        every { panditRepository.findByUserId(userId) } returns null
        every { panditRepository.save(any()) } answers {
            firstArg<Pandit>().apply {
                val f = Pandit::class.java.getDeclaredField("id")
                f.isAccessible = true; f.set(this, panditId)
            }
        }

        val result = panditService.createProfile(userId, request)
        assertEquals("New Pandit", result.name)
        assertEquals(PanditStatus.PENDING_VERIFICATION, result.status)
    }

    @Test
    fun `should reject duplicate profile`() {
        every { panditRepository.findByUserId(userId) } returns testPandit

        assertThrows<IllegalStateException> {
            panditService.createProfile(userId, CreatePanditProfileRequest(
                name = "X", city = "X", state = "X", experienceYears = 1,
                specializations = emptySet(), languages = emptySet()
            ))
        }
    }

    @Test
    fun `should verify pandit and set active`() {
        val pending = Pandit(
            id = panditId, userId = userId, name = "P",
            status = PanditStatus.PENDING_VERIFICATION, verified = false
        )
        every { panditRepository.findById(panditId) } returns Optional.of(pending)
        every { panditRepository.save(any()) } answers { firstArg() }

        val result = panditService.verifyPandit(panditId)

        assertTrue(result.verified)
        assertEquals(PanditStatus.ACTIVE, result.status)
    }

    @Test
    fun `should get profile by ID`() {
        every { panditRepository.findById(panditId) } returns Optional.of(testPandit)

        val result = panditService.getProfile(panditId)
        assertEquals("Pandit Sharma", result.name)
    }
}
