package com.school.repository;

import com.school.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository
        extends JpaRepository<Subject, Long> {
}