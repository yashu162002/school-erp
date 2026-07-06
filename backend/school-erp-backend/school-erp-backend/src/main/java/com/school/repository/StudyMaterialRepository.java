package com.school.repository;

import com.school.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    List<StudyMaterial> findByClassNameAndSection(String className, String section);
    List<StudyMaterial> findByTeacherId(Long teacherId);
}
