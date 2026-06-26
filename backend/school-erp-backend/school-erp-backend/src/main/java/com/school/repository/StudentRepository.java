package com.school.repository;

import com.school.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Optional<Student> findByAdmissionNo(String admissionNo);

    boolean existsByAdmissionNo(String admissionNo);

    Page<Student> findAll(Pageable pageable);

    List<Student> findByFirstNameContainingIgnoreCase(
            String name);
}