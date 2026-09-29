package com.cms.module.notification.dto;

import com.cms.module.notification.entity.NotificationType;
import lombok.Data;

@Data
public class NotificationPreferenceResponse {
    private Long id;
    private NotificationType notificationType;
    private Boolean emailEnabled;
    private Boolean inAppEnabled;
}
