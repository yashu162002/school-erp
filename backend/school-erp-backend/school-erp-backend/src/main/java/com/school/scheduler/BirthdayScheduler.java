package com.school.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BirthdayScheduler {

@Scheduled(cron = "0 0 8 * * *")
public void sendBirthdayCalls() {

    log.info("Checking birthdays...");

}

}
