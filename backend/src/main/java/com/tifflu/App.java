package com.tifflu;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Auto-migrate schema
                jdbcTemplate.execute("ALTER TABLE Menu_Items ADD COLUMN is_chef_special BOOLEAN DEFAULT FALSE");
                System.out.println("✅ Schema Updated: added is_chef_special column");
            } catch (Exception e) {
                // Ignore if column exists
                System.out.println("ℹ️ Schema Update Skipped (Column likely exists): " + e.getMessage());
            }
        };
    }
}
