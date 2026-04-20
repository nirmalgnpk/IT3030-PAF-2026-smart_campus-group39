package com.smartcampus.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

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

        String location = "file:" + absolutePath + "/";

        registry.addResourceHandler("/uploads/profile-photos/**")
                .addResourceLocations(location);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}