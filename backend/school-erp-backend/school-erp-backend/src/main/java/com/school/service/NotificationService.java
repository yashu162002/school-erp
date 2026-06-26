package com.school.service;

import com.school.dto.NotificationRequest;
import com.school.entity.Notification;

import java.util.List;

public interface NotificationService {

    Notification createNotification(
            NotificationRequest request);

    List<Notification> getAllNotifications();
}