package com.gestionPeliculas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers(HttpMethod.POST, "/api/usuarios", "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/peliculas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/peliculas/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/comentarios").permitAll()
                        // Endpoints de administrador
                        .requestMatchers("/api/admin/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/usuarios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.POST, "/api/peliculas/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/peliculas/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/peliculas/**").hasRole("ADMINISTRADOR")
                        // Resto requiere autenticación
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
