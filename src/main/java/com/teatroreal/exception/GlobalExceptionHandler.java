package com.teatroreal.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para devolver respuestas JSON coherentes
 * y registrar trazas en los logs.
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(ValidationException ex) {
        log.warn("ValidationException: {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("error", "validation_error");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /**
     * Maneja IllegalArgumentException lanzadas por validaciones internas (p.ej. departamento inválido)
     * y las transforma en 400 Bad Request para que el frontend reciba un mensaje claro.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("IllegalArgumentException (validation): {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("error", "validation_error");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /**
     * Captura errores de deserialización JSON (por ejemplo valores inválidos para enums)
     * y los transforma en un error 400 con mensaje legible para el frontend.
     *
     * Esto evita que una InvalidFormatException/HttpMessageNotReadableException
     * provoque un 500 genérico cuando el cliente envía un valor inválido
     * (p. ej. tipoElemento = "ESCENA" que no existe en el enum).
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("HttpMessageNotReadableException: {}", ex.getMessage());
        String message = "JSON de la petición inválido";

        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException) {
            InvalidFormatException ife = (InvalidFormatException) cause;
            String targetType = ife.getTargetType() != null ? ife.getTargetType().getSimpleName() : "desconocido";
            Object value = ife.getValue();
            String valueStr = value != null ? String.valueOf(value) : "null";
            message = String.format("Valor inválido '%s' para tipo %s", valueStr, targetType);
            log.debug("InvalidFormatException targetType={}, value={}", targetType, valueStr);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("error", "validation_error");
        body.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnhandledException(Exception ex) {
        log.error("Unhandled exception caught: {}", ex.getMessage(), ex);
        Map<String, Object> body = new HashMap<>();
        body.put("error", "internal_error");
        body.put("message", "Se ha producido un error interno en el servidor");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
