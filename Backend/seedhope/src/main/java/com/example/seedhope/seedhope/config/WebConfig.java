package com.example.seedhope.seedhope.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow CORS on all endpoints
                .allowedOrigins("http://localhost:3000", "http://10.0.2.2:3000", "http://192.168.0.106:8081", "http://localhost:8081", "http://localhost:8080", "http://192.168.0.106:8080") // Adjust origin based on frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed methods
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
