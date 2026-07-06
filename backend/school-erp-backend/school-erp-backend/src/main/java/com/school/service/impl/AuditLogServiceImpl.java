package com.school.service.impl;

import com.school.entity.AuditLog;
import com.school.repository.AuditLogRepository;
import com.school.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository repository;

    @Override
    @Async
    public void log(String username, String role, String action, String details) {
        AuditLog log = AuditLog.builder()
                .username(username)
                .role(role)
                .action(action)
                .details(details)
                .build();
        repository.save(log);
    }
}
