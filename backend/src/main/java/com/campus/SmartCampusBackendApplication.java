package com.campus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.campus", "lk.sliit.it3030.smartcampus.ticket"})
@EnableJpaRepositories(basePackages = {"com.campus", "lk.sliit.it3030.smartcampus.ticket"})
@EntityScan(basePackages = {"com.campus", "lk.sliit.it3030.smartcampus.ticket"})
public class SmartCampusBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusBackendApplication.class, args);
    }
}
