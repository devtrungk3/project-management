package com.example.server;

import com.example.server.model.entity.Role;
import com.example.server.model.entity.User;
import com.example.server.model.enums.UserStatus;
import com.example.server.repository.RoleRepository;
import com.example.server.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableCaching
@EnableAspectJAutoProxy
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}
	private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
	@Bean
	CommandLineRunner initDatabase(RoleRepository roleRepository,
								   UserRepository userRepository) {
		return args -> {
			Role adminRole = roleRepository.findByName("ADMIN")
					.orElseGet(() -> roleRepository.save(new Role(0, "ADMIN", null, null)));
			Role userRole = roleRepository.findByName("USER")
					.orElseGet(() -> roleRepository.save(new Role(0, "USER", null, null)));

			if (!userRepository.existsByUsername("admin")) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(encoder.encode("admin123"));
				admin.setFullname("Administrator");
				admin.setStatus(UserStatus.ACTIVE);
				admin.setRole(adminRole);
				userRepository.save(admin);
			}

			if (!userRepository.existsByUsername("devtrung")) {
				User user = new User();
				user.setUsername("devtrung");
				user.setPassword(encoder.encode("dev"));
				user.setFullname("Regular User");
				user.setStatus(UserStatus.ACTIVE);
				user.setRole(userRole);
				userRepository.save(user);
			}
		};
	}
}