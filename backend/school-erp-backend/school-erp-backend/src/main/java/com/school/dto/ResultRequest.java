package com.school.dto;

import lombok.Data;

@Data
public class ResultRequest {

    private Long studentId;

    private Long examId;

    private Long subjectId;

    private Double marksObtained;

    private Double maxMarks;
}