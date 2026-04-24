package lk.sliit.it3030.smartcampus.auth.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.sliit.it3030.smartcampus.auth.entity.AppUser;
import lk.sliit.it3030.smartcampus.auth.repository.AppUserRepository;
import lk.sliit.it3030.smartcampus.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AppUserRepository appUserRepository;
    private final AuthService authService;

    @Value("${app.oauth2.success-redirect-uri}")
    private String successRedirectUri;

    public OAuth2LoginSuccessHandler(AppUserRepository appUserRepository, AuthService authService) {
        this.appUserRepository = appUserRepository;
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        if (!(authentication.getPrincipal() instanceof OAuth2User oauth2User)) {
            response.sendRedirect(buildFailureRedirect("oauth_principal_invalid"));
            return;
        }

        String email = Optional.ofNullable(oauth2User.<String>getAttribute("email"))
                .map(value -> value.toLowerCase(Locale.ROOT).trim())
                .orElse("");

        if (email.isBlank()) {
            response.sendRedirect(buildFailureRedirect("oauth_email_missing"));
            return;
        }

        String name = Optional.ofNullable(oauth2User.<String>getAttribute("name"))
                .filter(value -> !value.isBlank())
                .orElse(email);

        String pictureUrl = oauth2User.getAttribute("picture");

        AppUser user = appUserRepository.findByEmail(email)
                .map(existing -> updateOAuthProfile(existing, name, pictureUrl))
                .orElseGet(() -> createOAuthUser(email, name, pictureUrl));

        AppUser savedUser = appUserRepository.save(user);
        String token = authService.issueToken(savedUser.getId());

        String redirectUrl = UriComponentsBuilder
                .fromUriString(successRedirectUri)
                .queryParam("token", token)
                .build(true)
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private AppUser updateOAuthProfile(AppUser existing, String name, String pictureUrl) {
        existing.setName(name);
        existing.setProvider("GOOGLE");
        if (pictureUrl != null && !pictureUrl.isBlank()) {
            existing.setProfilePictureUrl(pictureUrl);
        }
        if (existing.getRoles().isEmpty()) {
            existing.setRoles(Set.of("USER"));
        }
        if (existing.getPassword() == null || existing.getPassword().isBlank()) {
            existing.setPassword("oauth-" + UUID.randomUUID());
        }
        return existing;
    }

    private AppUser createOAuthUser(String email, String name, String pictureUrl) {
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setName(name);
        user.setProvider("GOOGLE");
        user.setPassword("oauth-" + UUID.randomUUID());
        user.setRoles(Set.of("USER"));
        user.setProfilePictureUrl(pictureUrl);
        return user;
    }

    private String buildFailureRedirect(String errorCode) {
        return UriComponentsBuilder
                .fromUriString(successRedirectUri)
                .replacePath("/login")
                .replaceQueryParam("error", errorCode)
                .build(true)
                .toUriString();
    }
}
