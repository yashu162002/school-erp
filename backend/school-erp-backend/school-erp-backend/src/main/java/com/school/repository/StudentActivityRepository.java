package com.school.repository;

import com.school.entity.StudentActivity;
import com.school.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentActivityRepository extends JpaRepository<StudentActivity, Long> {
    void deleteByStudent(Student student);
    List<StudentActivity> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<StudentActivity> findByStudentStudentIdOrderByCreatedAtDesc(String studentId);
}
