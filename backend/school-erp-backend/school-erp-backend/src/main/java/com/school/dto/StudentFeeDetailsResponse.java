package com.school.dto;

import com.school.entity.Fee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentFeeDetailsResponse {

    private Long id;

    private String admissionNo;

    private String firstName;

    private String lastName;

    private String className;

    private String section;

    private List<Fee> fees;

}
