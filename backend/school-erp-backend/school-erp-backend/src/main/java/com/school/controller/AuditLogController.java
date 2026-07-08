package com.school.controller;

import com.school.entity.AuditLog;
import com.school.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public Page<AuditLog> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action) {

        Sort sort = Sort.by(Sort.Direction.DESC, "timestamp");
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty() && action != null && !action.trim().isEmpty()) {
            return auditLogRepository.findByUsernameContainingIgnoreCaseAndAction(search, action, pageRequest);
        } else if (search != null && !search.trim().isEmpty()) {
            return auditLogRepository.findByUsernameContainingIgnoreCase(search, pageRequest);
        } else if (action != null && !action.trim().isEmpty()) {
            return auditLogRepository.findByAction(action, pageRequest);
        } else {
            return auditLogRepository.findAll(pageRequest);
        }
    }
}
