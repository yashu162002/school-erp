package com.school.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentDashboardResponse {

    private Long studentId;

    private String studentName;

    private String className;

    private String section;

    private Long attendanceCount;

    private Long announcementCount;

    private Long resultCount;
}