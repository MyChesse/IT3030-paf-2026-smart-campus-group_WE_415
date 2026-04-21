package lk.sliit.it3030.smartcampus.auth.controller;

import jakarta.validation.Valid;
import lk.sliit.it3030.smartcampus.auth.dto.AuthRequests;
import lk.sliit.it3030.smartcampus.auth.entity.AppUser;
import lk.sliit.it3030.smartcampus.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/api/auth/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody AuthRequests.SignupRequest request) {
        return ResponseEntity.status(201).body(authService.signup(request));
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AuthRequests.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/api/auth/me")
    public ResponseEntity<Map<String, Object>> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        AppUser user = authService.getCurrentUser(authHeader);
        return ResponseEntity.ok(authService.toUserResponse(user));
    }

    @PutMapping("/api/auth/me")
    public ResponseEntity<Map<String, Object>> updateMe(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @Valid @RequestBody AuthRequests.UpdateProfileRequest request
    ) {
        AppUser user = authService.updateProfile(authHeader, request);
        return ResponseEntity.ok(authService.toUserResponse(user));
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody AuthRequests.ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/api/auth/reset-password/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtpResetPassword(
            @Valid @RequestBody AuthRequests.ResetPasswordVerifyOtpRequest request
    ) {
        return ResponseEntity.ok(authService.verifyOtpResetPassword(request));
    }
}
