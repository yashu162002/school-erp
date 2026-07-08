package com.school.controller;

import com.school.dto.response.DashboardResponse;
import com.school.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardResponse dashboard() {
        return service.getDashboardStats();
    }

    @GetMapping("/attendance-stats")
    public Map<String, Object> getAttendanceStats() {
        return service.getAttendanceDashboardStats();
    }
}