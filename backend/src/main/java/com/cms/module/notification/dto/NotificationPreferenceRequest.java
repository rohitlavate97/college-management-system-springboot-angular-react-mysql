package com.cms.module.notification.dto;

import com.cms.module.notification.entity.NotificationType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationPreferenceRequest {
    @NotNull(message = "Notification type is required")
    private NotificationType notificationType;

    @NotNull(message = "Email enabled flag is required")
    private Boolean emailEnabled;

    @NotNull(message = "In-app enabled flag is required")
    private Boolean inAppEnabled;
}
