package com.campus.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthRequests {

    @Data
    public static class SignupRequest {
        @NotBlank
        private String name;

        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class UpdateProfileRequest {
        @NotBlank
        private String name;

        private String profilePictureUrl;
    }

    @Data
    public static class ForgotPasswordRequest {
        @Email
        @NotBlank
        private String email;
    }

    @Data
    public static class ResetPasswordVerifyOtpRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String otp;

        @NotBlank
        private String newPassword;
    }
}
