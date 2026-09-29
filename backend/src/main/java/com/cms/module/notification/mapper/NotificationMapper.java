package com.cms.module.notification.mapper;

import com.cms.module.notification.dto.NotificationPreferenceResponse;
import com.cms.module.notification.dto.NotificationResponse;
import com.cms.module.notification.entity.Notification;
import com.cms.module.notification.entity.NotificationPreference;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toNotificationResponse(Notification notification) {
        if (notification == null) return null;
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setReferenceType(notification.getReferenceType());
        response.setReferenceId(notification.getReferenceId());
        response.setIsRead(notification.getIsRead());
        response.setReadAt(notification.getReadAt());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }

    public NotificationPreferenceResponse toPreferenceResponse(NotificationPreference preference) {
        if (preference == null) return null;
        NotificationPreferenceResponse response = new NotificationPreferenceResponse();
        response.setId(preference.getId());
        response.setNotificationType(preference.getNotificationType());
        response.setEmailEnabled(preference.getEmailEnabled());
        response.setInAppEnabled(preference.getInAppEnabled());
        return response;
    }
}
