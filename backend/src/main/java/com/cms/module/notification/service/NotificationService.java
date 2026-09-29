package com.cms.module.notification.service;

import com.cms.module.notification.dto.NotificationPreferenceRequest;
import com.cms.module.notification.dto.NotificationPreferenceResponse;
import com.cms.module.notification.dto.NotificationResponse;
import com.cms.module.notification.dto.SendNotificationRequest;

import java.util.List;

public interface NotificationService {
    void sendNotification(SendNotificationRequest request);
    List<NotificationResponse> getUserNotifications(Long userId);
    void markAsRead(Long id, Long userId);
    void markAllAsRead(Long userId);
    long getUnreadCount(Long userId);
    List<NotificationPreferenceResponse> getPreferences(Long userId);
    NotificationPreferenceResponse updatePreferences(Long userId, NotificationPreferenceRequest request);
}
