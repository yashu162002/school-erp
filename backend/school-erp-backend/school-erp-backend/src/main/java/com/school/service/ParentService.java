package com.school.service;

import com.school.dto.ParentDashboardResponse;
import com.school.entity.Attendance;
import com.school.entity.Parent;

import java.util.List;

public interface ParentService {

    Parent createParent(Parent parent);

    List<Parent> getAllParents();

    Parent updateParent(Long id, Parent parent);

    void deleteParent(Long id);

    // Parent Dashboard
    ParentDashboardResponse getDashboard(Long parentId);

    // Child Attendance
    List<Attendance> getChildAttendance(Long parentId);
}