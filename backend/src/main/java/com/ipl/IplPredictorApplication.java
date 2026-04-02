package com.ipl;

import com.ipl.service.MatchService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.InputStream;

@SpringBootApplication
@EntityScan("com.ipl.model")
@EnableJpaRepositories("com.ipl.repository")
public class IplPredictorApplication implements CommandLineRunner {

    @Autowired
    private MatchService matchService;

    public static void main(String[] args) {
        SpringApplication.run(IplPredictorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            InputStream inputStream = getClass().getResourceAsStream("/data/matches.csv");
            if (inputStream == null) {
                System.err.println("Failed to find matches.csv in classpath");
                return;
            }
            matchService.importMatchesFromExcel(inputStream);
            System.out.println("Matches imported successfully from Excel.");
        } catch (Exception e) {
            System.err.println("Failed to import matches from Excel: " + e.getMessage());
        }
    }
}