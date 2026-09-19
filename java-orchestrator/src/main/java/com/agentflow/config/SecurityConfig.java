package com.agentflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security configuration.
 *
 * FIX A-4 / A-7: CORS is now explicitly configured so that a frontend dev server
 * (React on :3000, Vite on :5173) can call the API without browser CORS errors.
 *
 * JWT auth is intentionally NOT yet wired — JJWT dependency is present in pom.xml
 * and ready. Implement a JwtAuthenticationFilter and swap permitAll() → authenticated()
 * on /api/tasks/** before going to production.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * FIX A-7: CORS configuration for local frontend development.
     * Update allowedOrigins to match your production frontend URL before deploying.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",  // React (CRA / Next.js dev)
                "http://localhost:5173"   // Vite dev server
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // FIX C-4 prerequisite: CSRF disabled — API is stateless (frontend uses JSON)
            .csrf(csrf -> csrf.disable())
            // Apply CORS rules defined above
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Public: task submission and result retrieval
                // TODO: Replace permitAll() with .authenticated() once JWT is wired
                .requestMatchers("/api/**").permitAll()
                // Actuator health endpoint — keep open for load balancer probes
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
