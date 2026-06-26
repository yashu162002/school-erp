package com.school.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParentDashboardResponse {

    private Long parentId;

    private String parentName;

    private Long studentId;

    private String studentName;

    private String className;

    private Double attendancePercentage;

    private Long unreadNotifications;
}