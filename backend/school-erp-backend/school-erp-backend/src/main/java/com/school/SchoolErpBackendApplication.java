package com.school;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableScheduling
@EnableAsync
@SpringBootApplication
public class SchoolErpBackendApplication {

public static void main(String[] args) {
    SpringApplication.run(SchoolErpBackendApplication.class, args);
}


}
