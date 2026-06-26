package com.school.controller;

import com.school.dto.NotificationRequest;
import com.school.entity.Notification;
import com.school.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping
    public Notification create(
            @RequestBody NotificationRequest request){

        return service.createNotification(request);
    }

    @GetMapping
    public List<Notification> getAll(){

        return service.getAllNotifications();
    }
}