package lk.sliit.it3030.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "lk.sliit.it3030.smartcampus")
public class SmartCampusBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusBackendApplication.class, args);
    }
}