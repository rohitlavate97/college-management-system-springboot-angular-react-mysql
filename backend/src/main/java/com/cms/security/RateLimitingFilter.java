package com.cms.security;

import com.cms.exception.ApiError;
import com.cms.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 5;
    private static final long WINDOW_MS = 60_000L;

    private final Map<String, RequestTracker> ipTracker = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private static class RequestTracker {
        long windowStart;
        int count;

        RequestTracker(long start) {
            this.windowStart = start;
            this.count = 1;
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        boolean isAuthEndpoint = ("/api/v1/auth/login".equalsIgnoreCase(path) || "/api/v1/auth/refresh-token".equalsIgnoreCase(path));
        if (isAuthEndpoint && "POST".equalsIgnoreCase(request.getMethod())) {
            String clientIp = getClientIp(request);
            long now = Instant.now().toEpochMilli();

            RequestTracker tracker = ipTracker.compute(clientIp, (ip, current) -> {
                if (current == null || (now - current.windowStart) > WINDOW_MS) {
                    return new RequestTracker(now);
                }
                current.count++;
                return current;
            });

            if (tracker.count > MAX_REQUESTS_PER_MINUTE) {
                log.warn("Rate limit exceeded for IP: {} on endpoint: {}", clientIp, path);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                ApiError error = new ApiError(
                        LocalDateTime.now(),
                        HttpStatus.TOO_MANY_REQUESTS.value(),
                        ErrorCode.RATE_LIMIT_EXCEEDED,
                        "Too many login attempts. Please wait 1 minute before trying again.",
                        path,
                        null,
                        null
                );

                response.getWriter().write(objectMapper.writeValueAsString(error));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
