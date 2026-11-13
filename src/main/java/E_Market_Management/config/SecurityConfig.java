package E_Market_Management.config;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import E_Market_Management.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.json.JsonMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import E_Market_Management.auth.security.CustomUserDetailsService;
import E_Market_Management.auth.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CustomUserDetailsService userDetailsService) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;

    }

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        JsonMapper jsonMapper,
        CorsConfigurationSource corsConfigurationSource
    ) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> writeSecurityError(
                    request, response, jsonMapper, HttpStatus.UNAUTHORIZED, "Authentication is required"
                ))
                .accessDeniedHandler((request, response, exception) -> writeSecurityError(
                    request, response, jsonMapper, HttpStatus.FORBIDDEN, "You do not have permission to access this resource"
                ))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    HttpMethod.PATCH,
                    "/api/auth/change-password"
                ).authenticated()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/frontend/**").permitAll()
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/**"
                ).permitAll()
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/users"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/users/profile"
                ).authenticated()
                .requestMatchers(
                    HttpMethod.PATCH,
                    "/api/users/profile"
                ).authenticated()
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/reviews",
                    "/api/reviews/**"
                ).permitAll()
                .requestMatchers(HttpMethod.POST, "/api/reviews/product/**")
                    .hasAnyRole("CUSTOMER", "MEMBER")
                .requestMatchers(HttpMethod.PUT, "/api/reviews/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/orders"
                ).permitAll()
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/orders/{id}"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/brand/**"
                ).permitAll()
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/orders"
                ).hasRole("ADMIN")
                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/membership"
                ).hasRole("ADMIN")
                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/membership"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/category"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/category/**"
                ).permitAll()
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/category/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/category/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/brand/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/brand/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/brand/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/products/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/products/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/products/**"
                ).hasRole("ADMIN")
                .requestMatchers(
                    HttpMethod.PATCH,
                    "/api/users/profile/{id}"
                ).hasRole("ADMIN")
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()
                .requestMatchers(
                    HttpMethod.POST, 
                    "/api/orders/track"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
        @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}") String allowedOrigins
    ) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isEmpty())
            .toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    private void writeSecurityError(
        HttpServletRequest request,
        HttpServletResponse response,
        JsonMapper jsonMapper,
        HttpStatus status,
        String message
    ) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        jsonMapper.writeValue(response.getOutputStream(), new ApiResponse(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI()
        ));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean 
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
