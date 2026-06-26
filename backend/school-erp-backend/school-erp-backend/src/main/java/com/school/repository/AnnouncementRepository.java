package com.school.repository;

import com.school.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long> {
}