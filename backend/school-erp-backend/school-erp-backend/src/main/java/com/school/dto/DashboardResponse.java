package com.school.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private Long totalStudents;

    private Long totalTeachers;

    private Long totalParents;

    private Long totalAttendance;
}