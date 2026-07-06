package com.school.dto;

import lombok.Data;

@Data
public class LeaveRequestDto {

    private Long studentId;

    private String reason;

    private String fromDate;

    private String toDate;
}