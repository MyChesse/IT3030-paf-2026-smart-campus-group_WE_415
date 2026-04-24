package com.campus.admin.controller;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.campus.auth.entity.AppUser;
import com.campus.auth.repository.AppUserRepository;
import com.campus.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AppUserRepository appUserRepository;
    private final AuthService authService;

    public AdminController(AppUserRepository appUserRepository, AuthService authService) {
        this.appUserRepository = appUserRepository;
        this.authService = authService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = appUserRepository.findAll().stream()
                .map(authService::toUserResponse)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<Map<String, Object>>> getTechnicians() {
        List<Map<String, Object>> technicians = appUserRepository.findAll().stream()
                .filter(user -> user.getRoles().contains("TECHNICIAN"))
                .map(authService::toUserResponse)
                .toList();
        return ResponseEntity.ok(technicians);
    }

    @PostMapping("/technicians")
    public ResponseEntity<Map<String, Object>> createTechnician(@RequestBody CreateTechnicianRequest request) {
        if (appUserRepository.findByEmail(request.getEmail().toLowerCase()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(request.getPassword());
        user.setRoles(Set.of("TECHNICIAN"));

        AppUser saved = appUserRepository.save(user);
        return ResponseEntity.status(201).body(authService.toUserResponse(saved));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().contains("ADMIN")) {
            throw new RuntimeException("Admin users cannot be deleted");
        }

        appUserRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    public static class CreateTechnicianRequest {
        @NotBlank
        private String name;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
