package com.cms.exception;

import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND, request, null);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicateResourceException(DuplicateResourceException ex, WebRequest request) {
        return buildErrorResponse(ex, HttpStatus.CONFLICT, ErrorCode.DUPLICATE_RESOURCE, request, null);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiError> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
        return buildErrorResponse(ex, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, request, null);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiError> handleForbiddenException(ForbiddenException ex, WebRequest request) {
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, request, null);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusinessException(BusinessException ex, WebRequest request) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, ErrorCode.BUSINESS_ERROR, request, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiError apiError = new ApiError(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            ErrorCode.VALIDATION_ERROR,
            "Validation failed",
            ((ServletWebRequest) request).getRequest().getRequestURI(),
            MDC.get("traceId"),
            errors
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGlobalException(Exception ex, WebRequest request) {
        return buildErrorResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR, request, null);
    }

    private ResponseEntity<ApiError> buildErrorResponse(Exception ex, HttpStatus status, ErrorCode code, WebRequest request, Map<String, String> validationErrors) {
        ApiError apiError = new ApiError(
            LocalDateTime.now(),
            status.value(),
            code,
            ex.getMessage(),
            ((ServletWebRequest) request).getRequest().getRequestURI(),
            MDC.get("traceId"),
            validationErrors
        );
        return new ResponseEntity<>(apiError, status);
    }
}
