package com.school.repository;

import com.school.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Optional<Student> findByAdmissionNo(String admissionNo);

    Optional<Student> findByStudentId(String studentId);

    boolean existsByStudentId(String studentId);

    boolean existsByAdmissionNo(String admissionNo);

    Page<Student> findAll(Pageable pageable);

    List<Student> findByFirstNameContainingIgnoreCase(
            String name);

    List<Student> findByClassName(String className);

    @Query("SELECT DISTINCT s.className FROM Student s WHERE s.className IS NOT NULL AND s.className <> ''")
    List<String> findDistinctClassNames();
}