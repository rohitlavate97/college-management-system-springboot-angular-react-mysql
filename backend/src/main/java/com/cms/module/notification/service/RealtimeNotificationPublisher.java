package com.cms.module.notification.service;

import com.cms.module.notification.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RealtimeNotificationPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastNotification(NotificationResponse notification) {
        log.info("Broadcasting notification to all users: {}", notification.getTitle());
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }

    public void sendToUser(String username, NotificationResponse notification) {
        log.info("Sending notification to user {}: {}", username, notification.getTitle());
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", notification);
    }
}
