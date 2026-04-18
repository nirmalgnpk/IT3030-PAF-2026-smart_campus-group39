package com.smartcampus.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Serves uploaded profile photos as static resources.
 * GET http://localhost:8080/uploads/profile-photos/{filename} → disk file
 *
 * NOTE: Delete WebConfig.java — keep only this file.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize()
                .toString();

        // Trailing slash is required for Spring to resolve files correctly
        String location = "file:" + absolutePath + "/";

        registry.addResourceHandler("/uploads/profile-photos/**")
                .addResourceLocations(location);

        // Also handle the shorter /uploads/** pattern used in SecurityConfig
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}