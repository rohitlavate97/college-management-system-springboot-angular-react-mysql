package com.cms.module.notification.service;

import com.cms.exception.ResourceNotFoundException;
import com.cms.module.notification.dto.NotificationPreferenceRequest;
import com.cms.module.notification.dto.NotificationPreferenceResponse;
import com.cms.module.notification.dto.NotificationResponse;
import com.cms.module.notification.dto.SendNotificationRequest;
import com.cms.module.notification.entity.Notification;
import com.cms.module.notification.entity.NotificationPreference;
import com.cms.module.notification.mapper.NotificationMapper;
import com.cms.module.notification.repository.NotificationPreferenceRepository;
import com.cms.module.notification.repository.NotificationRepository;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional
    public void sendNotification(SendNotificationRequest request) {
        if (request.getUserId() != null) {
            sendToUser(request.getUserId(), request);
        } else {
            List<User> users = userRepository.findAll();
            users.forEach(user -> sendToUser(user.getId(), request));
        }
    }

    private void sendToUser(Long userId, SendNotificationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        NotificationPreference preference = preferenceRepository.findByUserIdAndNotificationType(userId, request.getType())
                .orElse(null);

        if (preference != null && !preference.getInAppEnabled()) {
            return;
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setReferenceType(request.getReferenceType());
        notification.setReferenceId(request.getReferenceId());
        notification.setIsRead(false);
        
        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(notificationMapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Notification does not belong to user");
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsRead(userId, false);
        unread.forEach(n -> {
            n.setIsRead(true);
            n.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationPreferenceResponse> getPreferences(Long userId) {
        return preferenceRepository.findByUserId(userId).stream()
                .map(notificationMapper::toPreferenceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationPreferenceResponse updatePreferences(Long userId, NotificationPreferenceRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        NotificationPreference preference = preferenceRepository
                .findByUserIdAndNotificationType(userId, request.getNotificationType())
                .orElse(new NotificationPreference());

        if (preference.getId() == null) {
            preference.setUser(user);
            preference.setNotificationType(request.getNotificationType());
        }

        preference.setEmailEnabled(request.getEmailEnabled());
        preference.setInAppEnabled(request.getInAppEnabled());
        
        preference = preferenceRepository.save(preference);
        return notificationMapper.toPreferenceResponse(preference);
    }
}
