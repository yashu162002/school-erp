package com.school.repository;

import com.school.entity.StudentNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentNotificationRepository extends JpaRepository<StudentNotification, Long> {
    List<StudentNotification> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<StudentNotification> findByStudentStudentIdOrderByCreatedAtDesc(String studentId);
    long countByStudentStudentIdAndIsReadFalse(String studentId);
}
