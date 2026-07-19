package com.school.repository;

import com.school.entity.LeaveRequest;
import com.school.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    void deleteByStudent(Student student);
    List<LeaveRequest> findByStudentId(Long studentId);
    List<LeaveRequest> findByTeacherId(Long teacherId);
}