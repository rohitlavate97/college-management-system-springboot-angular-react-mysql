package com.cms.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
    LocalDateTime timestamp,
    int status,
    ErrorCode code,
    String message,
    String path,
    String traceId,
    Map<String, String> validationErrors
) {}
