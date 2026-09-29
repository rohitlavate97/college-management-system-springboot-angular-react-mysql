package com.cms.module.notification.controller;

import com.cms.module.notification.dto.NotificationPreferenceRequest;
import com.cms.module.notification.dto.NotificationPreferenceResponse;
import com.cms.module.notification.dto.NotificationResponse;
import com.cms.module.notification.dto.SendNotificationRequest;
import com.cms.module.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Management", description = "APIs for managing notifications")
public class NotificationController {

    private final NotificationService notificationService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Assuming user principal contains ID or we fetch it. 
        // For simplicity, let's assume we can get user by email and then ID, or the principal has it.
        // As a generic setup, let's parse it from a custom UserDetails if available.
        // Assuming CustomUserDetails has getId().
        com.cms.security.CustomUserDetails userDetails = 
            (com.cms.security.CustomUserDetails) auth.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    @Operation(summary = "Get current user notifications")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications() {
        return ResponseEntity.ok(notificationService.getUserNotifications(getCurrentUserId()));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount(getCurrentUserId()));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead(getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Send a notification")
    public ResponseEntity<Void> sendNotification(@Valid @RequestBody SendNotificationRequest request) {
        notificationService.sendNotification(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get user notification preferences")
    public ResponseEntity<List<NotificationPreferenceResponse>> getPreferences() {
        return ResponseEntity.ok(notificationService.getPreferences(getCurrentUserId()));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update user notification preferences")
    public ResponseEntity<NotificationPreferenceResponse> updatePreferences(
            @Valid @RequestBody NotificationPreferenceRequest request) {
        return ResponseEntity.ok(notificationService.updatePreferences(getCurrentUserId(), request));
    }
}
