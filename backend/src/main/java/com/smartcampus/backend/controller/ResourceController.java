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
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    /**
     * Get all resources with optional filtering
     * @param type optional resource type filter
     * @param location optional location filter
     * @param minCapacity optional minimum capacity filter
     * @return list of resources matching criteria
     */
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity) {

        List<Resource> resources;

        // If any filter is provided, use search method
        if (type != null || location != null || minCapacity != null) {
            resources = resourceService.searchResources(type, location, minCapacity);
        } else {
            // Otherwise, get all resources
            resources = resourceService.getAllResources();
        }

        return ResponseEntity.ok(resources);
    }

    /**
     * Get resource by ID
     * @param id the resource ID
     * @return resource if found, 404 otherwise
     */
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        Optional<Resource> resource = resourceService.getResourceById(id);

        if (resource.isPresent()) {
            return ResponseEntity.ok(resource.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create a new resource
     * @param resourceDTO the resource data transfer object
     * @return created resource with 201 status
     */
    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceDTO resourceDTO) {
        try {
            Resource createdResource = resourceService.createResource(resourceDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update an existing resource
     * @param id the resource ID
     * @param resourceDTO the updated resource data
     * @return updated resource with 200 status
     */
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceDTO resourceDTO) {

        try {
            Resource updatedResource = resourceService.updateResource(id, resourceDTO);
            return ResponseEntity.ok(updatedResource);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Resource not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete (soft delete) a resource by setting status to OUT_OF_SERVICE
     * @param id the resource ID
     * @return 204 No Content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Resource not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }
}
