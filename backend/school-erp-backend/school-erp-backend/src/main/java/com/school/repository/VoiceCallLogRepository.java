package com.school.repository;

import com.school.entity.VoiceCallLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoiceCallLogRepository
        extends JpaRepository<VoiceCallLog, Long> {
}