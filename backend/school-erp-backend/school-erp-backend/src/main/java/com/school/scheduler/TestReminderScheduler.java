package com.school.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TestReminderScheduler {

    @Scheduled(cron = "0 0 18 * * *")
    public void sendReminder() {

        log.info(
         "Sending test reminders..."
        );
    }
}