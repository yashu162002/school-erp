package com.school.service.impl;

import com.school.dto.NotificationRequest;
import com.school.entity.Notification;
import com.school.repository.NotificationRepository;
import com.school.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository repository;

    @Override
    public Notification createNotification(
            NotificationRequest request) {

        Notification notification =
                Notification.builder()
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .notificationType(
                                request.getNotificationType())
                        .targetAudience(
                                request.getTargetAudience())
                        .isRead(false)
                        .build();

        return repository.save(notification);
    }

    @Override
    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }
}