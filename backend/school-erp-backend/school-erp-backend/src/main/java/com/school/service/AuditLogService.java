package com.school.service;

public interface AuditLogService {
    void log(String username, String role, String action, String details);
}
