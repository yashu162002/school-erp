package com.school.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AbsentStudentScheduler {

    @Scheduled(cron = "0 0 17 * * *")
    public void absentAlert() {

        log.info(
         "Checking absent students..."
        );

        /*
          Get today's absentees
          Call parents
        */
    }
}