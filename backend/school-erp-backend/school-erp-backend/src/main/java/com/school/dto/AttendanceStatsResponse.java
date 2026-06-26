package com.school.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceStatsResponse {

    private Long totalDays;

    private Long presentDays;

    private Long absentDays;

    private Double percentage;
}