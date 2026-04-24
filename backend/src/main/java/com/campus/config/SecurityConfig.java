package lk.sliit.it3030.smartcampus.config;

import lk.sliit.it3030.smartcampus.auth.security.OAuth2LoginFailureHandler;
import lk.sliit.it3030.smartcampus.auth.security.OAuth2LoginSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2LoginSuccessHandler successHandler,
            OAuth2LoginFailureHandler failureHandler
    ) throws Exception {
        OAuth2AuthorizationRequestResolver authorizationRequestResolver =
                oauth2AuthorizationRequestResolver(clientRegistrationRepository);

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**", "/oauth2/**", "/login/**", "/error").permitAll()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth -> oauth
                        .authorizationEndpoint(endpoint -> endpoint
                                .authorizationRequestResolver(authorizationRequestResolver)
                        )
                        .successHandler(successHandler)
                        .failureHandler(failureHandler)
                );

        return http.build();
    }

    private OAuth2AuthorizationRequestResolver oauth2AuthorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository
    ) {
        DefaultOAuth2AuthorizationRequestResolver resolver =
                new DefaultOAuth2AuthorizationRequestResolver(clientRegistrationRepository, "/oauth2/authorization");

        resolver.setAuthorizationRequestCustomizer(customizer ->
                customizer.additionalParameters(params -> params.put("prompt", "select_account"))
        );

        return resolver;
    }
}
