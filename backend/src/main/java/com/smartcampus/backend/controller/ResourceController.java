package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.ResourceDTO;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "http://localhost:5173"})
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity) {

        if (type != null || location != null || minCapacity != null)
            return ResponseEntity.ok(resourceService.searchResources(type, location, minCapacity));
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        Optional<Resource> resource = resourceService.getResourceById(id);
        return resource.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceDTO resourceDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(resourceDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
            @PathVariable String id, @Valid @RequestBody ResourceDTO resourceDTO) {
        try {
            return ResponseEntity.ok(resourceService.updateResource(id, resourceDTO));
        } catch (RuntimeException e) {
            return e.getMessage().equals("Resource not found")
                    ? ResponseEntity.notFound().build()
                    : ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return e.getMessage().equals("Resource not found")
                    ? ResponseEntity.notFound().build()
                    : ResponseEntity.badRequest().build();
        }
    }
}