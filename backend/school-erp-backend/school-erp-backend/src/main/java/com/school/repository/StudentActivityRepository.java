package com.school.repository;

import com.school.entity.StudentActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentActivityRepository extends JpaRepository<StudentActivity, Long> {
    List<StudentActivity> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<StudentActivity> findByStudentStudentIdOrderByCreatedAtDesc(String studentId);
}
