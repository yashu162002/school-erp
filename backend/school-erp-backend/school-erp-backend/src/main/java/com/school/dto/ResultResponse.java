package com.school.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResultResponse {

    private Long id;
    private String studentName;
    private String examName;
    private String subjectName;
    private Double marksObtained;
    private Double maxMarks;
    private Double percentage;
    private String grade;
}