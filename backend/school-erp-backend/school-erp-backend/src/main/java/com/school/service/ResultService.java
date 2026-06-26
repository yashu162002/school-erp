package com.school.service;

import com.school.dto.ResultRequest;
import com.school.entity.Result;

import java.util.List;

public interface ResultService {

    Result saveResult(ResultRequest request);

    List<Result> getStudentResults(Long studentId);
}