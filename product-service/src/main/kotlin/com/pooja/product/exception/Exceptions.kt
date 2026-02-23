package com.pooja.product.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.Instant

data class ErrorResponse(val status: Int, val error: String, val message: String, val timestamp: Instant = Instant.now())

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(ex: NoSuchElementException) =
        ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse(404, "NOT_FOUND", ex.message ?: "Resource not found"))

    @ExceptionHandler(IllegalAccessException::class)
    fun handleForbidden(ex: IllegalAccessException) =
        ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ErrorResponse(403, "FORBIDDEN", ex.message ?: "Access denied"))

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleBadRequest(ex: IllegalArgumentException) =
        ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse(400, "BAD_REQUEST", ex.message ?: "Invalid request"))

    @ExceptionHandler(Exception::class)
    fun handleGeneral(ex: Exception) =
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse(500, "INTERNAL_ERROR", "An unexpected error occurred"))
}
