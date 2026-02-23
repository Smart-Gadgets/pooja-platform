package com.pooja.rag.controller

import com.pooja.rag.service.ChatResponse
import com.pooja.rag.service.RagService
import com.pooja.rag.service.SearchResult
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

data class ChatRequest(val message: String, val language: String = "en")
data class IngestRequest(val content: String, val metadata: Map<String, Any> = emptyMap())
data class SearchQueryRequest(val query: String, val topK: Int = 5)

@RestController
@RequestMapping("/api/v1/ai")
class RagController(private val ragService: RagService) {

    @PostMapping("/chat")
    fun chat(
        @RequestHeader("X-User-Id", required = false) userId: String?,
        @RequestBody request: ChatRequest
    ): ResponseEntity<ChatResponse> {
        return ResponseEntity.ok(ragService.chat(request.message, userId, request.language))
    }

    @PostMapping("/search")
    fun semanticSearch(@RequestBody request: SearchQueryRequest): ResponseEntity<List<SearchResult>> {
        return ResponseEntity.ok(ragService.semanticSearch(request.query, request.topK))
    }

    @PostMapping("/ingest")
    fun ingest(@RequestBody request: IngestRequest): ResponseEntity<Map<String, String>> {
        ragService.ingestDocument(request.content, request.metadata)
        return ResponseEntity.ok(mapOf("status" to "ingested"))
    }
}
