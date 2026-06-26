package com.school.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/teachers")
public class TeacherController {

    @GetMapping
    public String getAllTeachers() {
        return "Teacher List API";
    }

    @PostMapping
    public String addTeacher() {
        return "Teacher Added Successfully";
    }

    @PutMapping("/{id}")
    public String updateTeacher(
            @PathVariable Long id) {

        return "Teacher Updated Successfully. ID = " + id;
    }

    @DeleteMapping("/{id}")
    public String deleteTeacher(
            @PathVariable Long id) {

        return "Teacher Deleted Successfully. ID = " + id;
    }
}