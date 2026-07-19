package com.school.repository;

import com.school.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import com.school.entity.Student;
import java.util.Optional;

public interface ParentRepository
        extends JpaRepository<Parent, Long> {

    void deleteByStudent(Student student);
    Optional<Parent> findByStudent(Student student);
}