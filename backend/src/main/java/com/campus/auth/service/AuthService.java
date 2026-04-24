package com.campus.auth.service;

import com.campus.auth.dto.AuthRequests;
import com.campus.auth.entity.AppUser;
import com.campus.auth.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;

    private final Map<String, Long> tokenStore = new ConcurrentHashMap<>();
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public AuthService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public Map<String, Object> signup(AuthRequests.SignupRequest request) {
        if (appUserRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase(Locale.ROOT));
        user.setPassword(request.getPassword());
        user.setRoles(Set.of("USER"));

        AppUser saved = appUserRepository.save(user);
        String token = issueToken(saved.getId());
        return buildAuthResponse(saved, token);
    }

    public Map<String, Object> login(AuthRequests.LoginRequest request) {
        AppUser user = appUserRepository.findByEmail(request.getEmail().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!Objects.equals(user.getPassword(), request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = issueToken(user.getId());
        return buildAuthResponse(user, token);
    }

    public AppUser getCurrentUser(String authHeader) {
        return appUserRepository.findById(resolveUserId(authHeader))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AppUser updateProfile(String authHeader, AuthRequests.UpdateProfileRequest request) {
        AppUser user = getCurrentUser(authHeader);
        user.setName(request.getName());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        return appUserRepository.save(user);
    }

    public Map<String, Object> forgotPassword(AuthRequests.ForgotPasswordRequest request) {
        String otp = "123456";
        otpStore.put(request.getEmail().toLowerCase(Locale.ROOT), otp);

        return Map.of(
                "message", "If an account with that email exists, an OTP has been sent."
        );
    }

    public Map<String, Object> verifyOtpResetPassword(AuthRequests.ResetPasswordVerifyOtpRequest request) {
        String key = request.getEmail().toLowerCase(Locale.ROOT);
        String otp = otpStore.get(key);

        if (otp == null || !otp.equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        AppUser user = appUserRepository.findByEmail(key)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(request.getNewPassword());
        appUserRepository.save(user);
        otpStore.remove(key);

        return Map.of("message", "Password reset successfully.");
    }

    public Long resolveUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Long id = tokenStore.get(token);
            if (id != null) {
                return id;
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    public String issueToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, userId);
        return token;
    }

    private Map<String, Object> buildAuthResponse(AppUser user, String token) {
        Map<String, Object> response = toUserResponse(user);
        response.put("token", token);
        return response;
    }

    public Map<String, Object> toUserResponse(AppUser user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("roles", user.getRoles());
        response.put("provider", user.getProvider());
        response.put("profilePictureUrl", user.getProfilePictureUrl());
        response.put("createdAt", user.getCreatedAt());
        return response;
    }
}
