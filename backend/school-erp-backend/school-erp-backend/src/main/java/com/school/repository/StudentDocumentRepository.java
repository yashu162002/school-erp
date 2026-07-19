package com.school.repository;

import com.school.entity.StudentDocument;
import com.school.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {
    void deleteByStudent(Student student);
    List<StudentDocument> findByStudentId(Long studentId);
    List<StudentDocument> findByStudentStudentId(String studentId);
}
