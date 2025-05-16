package com.microloan;

import com.microloan.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MicroloanApplication {
	public static void main(String[] args) {
		SpringApplication.run(MicroloanApplication.class, args);
	}

	@Bean
	public CommandLineRunner runPasswordMigration(UserService userService) {
		return args -> {
			userService.migratePasswordsToBCrypt();
		};
	}
}
