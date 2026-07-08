package com.school.service;

import com.school.dto.response.DashboardResponse;
import java.util.Map;

public interface DashboardService {

    DashboardResponse getDashboardStats();

    Map<String, Object> getAttendanceDashboardStats();
}