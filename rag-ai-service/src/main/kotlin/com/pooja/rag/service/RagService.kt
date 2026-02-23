package com.pooja.rag.service

import org.slf4j.LoggerFactory
import org.springframework.ai.chat.client.ChatClient
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor
import org.springframework.ai.document.Document
import org.springframework.ai.vectorstore.SearchRequest
import org.springframework.ai.vectorstore.VectorStore
import org.springframework.stereotype.Service

@Service
class RagService(
    private val chatClient: ChatClient,
    private val vectorStore: VectorStore
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun chat(userMessage: String, userId: String?, language: String = "en"): ChatResponse {
        val langInstruction = when (language) {
            "hi" -> "Respond in Hindi (Devanagari script)."
            "ta" -> "Respond in Tamil."
            else -> "Respond in English."
        }

        val response = chatClient.prompt()
            .user("$langInstruction\n\nUser query: $userMessage")
            .advisors(
                QuestionAnswerAdvisor(
                    vectorStore,
                    SearchRequest.builder()
                        .query(userMessage)
                        .topK(5)
                        .similarityThreshold(0.7)
                        .build()
                )
            )
            .call()
            .content() ?: "I'm sorry, I couldn't process your request. Please try again."

        return ChatResponse(
            message = response,
            sources = emptyList() // Sources can be extracted from advisor context
        )
    }

    fun ingestDocument(content: String, metadata: Map<String, Any>) {
        try {
            val document = Document(content, metadata)
            vectorStore.add(listOf(document))
            log.info("Ingested document with metadata: {}", metadata)
        } catch (e: Exception) {
            log.error("Failed to ingest document: {}", e.message)
        }
    }

    fun ingestProduct(productId: String, name: String, description: String?, category: String, price: String, tags: List<String>) {
        val content = buildString {
            append("Product: $name\n")
            append("Category: $category\n")
            append("Price: ₹$price\n")
            description?.let { append("Description: $it\n") }
            if (tags.isNotEmpty()) append("Ritual Tags: ${tags.joinToString(", ")}\n")
        }
        ingestDocument(content, mapOf(
            "type" to "product", "productId" to productId,
            "category" to category, "price" to price
        ))
    }

    fun ingestPandit(panditId: String, name: String, bio: String?, specializations: List<String>, city: String?, languages: List<String>) {
        val content = buildString {
            append("Pandit: $name\n")
            if (specializations.isNotEmpty()) append("Specializations: ${specializations.joinToString(", ")}\n")
            city?.let { append("Location: $it\n") }
            if (languages.isNotEmpty()) append("Languages: ${languages.joinToString(", ")}\n")
            bio?.let { append("About: $it\n") }
        }
        ingestDocument(content, mapOf(
            "type" to "pandit", "panditId" to panditId,
            "city" to (city ?: "")
        ))
    }

    fun semanticSearch(query: String, topK: Int = 5): List<SearchResult> {
        val results = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(topK)
                .similarityThreshold(0.6)
                .build()
        )
        return results?.map { doc ->
            SearchResult(
                content = doc.text ?: "",
                metadata = doc.metadata,
                score = doc.metadata["distance"] as? Double
            )
        } ?: emptyList()
    }
}

data class ChatResponse(val message: String, val sources: List<String>)
data class SearchResult(val content: String, val metadata: Map<String, Any>, val score: Double?)
