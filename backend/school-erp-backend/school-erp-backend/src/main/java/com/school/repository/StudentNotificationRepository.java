package com.school.repository;

import com.school.entity.StudentNotification;
import com.school.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentNotificationRepository extends JpaRepository<StudentNotification, Long> {
    void deleteByStudent(Student student);
    List<StudentNotification> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<StudentNotification> findByStudentStudentIdOrderByCreatedAtDesc(String studentId);
    long countByStudentStudentIdAndIsReadFalse(String studentId);
}
