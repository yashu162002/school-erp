package com.school.controller;

import com.school.dto.ResultRequest;
import com.school.entity.Result;
import com.school.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    public Result saveResult(
            @RequestBody ResultRequest request) {

        return resultService.saveResult(request);
    }

    @GetMapping("/student/{studentId}")
    public List<Result> getStudentResults(
            @PathVariable Long studentId) {

        return resultService.getStudentResults(studentId);
    }
}