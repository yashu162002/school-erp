package com.school.service.impl;

import com.school.service.VoiceCallService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class VoiceCallServiceImpl
        implements VoiceCallService {

    @Override
    public void makeBirthdayCall(
            String phoneNumber,
            String studentName) {

        log.info(
         "Birthday Call -> {} {}",
          phoneNumber,
          studentName
        );
    }

    @Override
    public void makeAbsentCall(
            String phoneNumber,
            String studentName) {

        log.info(
         "Absent Alert -> {} {}",
          phoneNumber,
          studentName
        );
    }

    @Override
    public void makeTestReminderCall(
            String phoneNumber,
            String examName) {

        log.info(
         "Test Reminder -> {} {}",
          phoneNumber,
          examName
        );
    }
}