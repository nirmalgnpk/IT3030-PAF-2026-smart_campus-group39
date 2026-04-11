package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceDTO;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    /**
     * Get all resources
     * @return list of all resources
     */
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    /**
     * Get resource by ID
     * @param id the resource ID
     * @return Optional containing the resource if found
     */
    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    /**
     * Search resources by type, location, and minimum capacity
     * @param type the type of resource (optional, can be null)
     * @param location the location of resource (optional, can be null)
     * @param minCapacity the minimum capacity required (optional, can be null)
     * @return list of resources matching the criteria
     */
    public List<Resource> searchResources(String type, String location, Integer minCapacity) {
        List<Resource> resources = resourceRepository.findAll();

        // Filter by type
        if (type != null && !type.isEmpty()) {
            resources = resources.stream()
                    .filter(r -> r.getType().equalsIgnoreCase(type))
                    .collect(Collectors.toList());
        }

        // Filter by location
        if (location != null && !location.isEmpty()) {
            resources = resources.stream()
                    .filter(r -> r.getLocation().equalsIgnoreCase(location))
                    .collect(Collectors.toList());
        }

        // Filter by minimum capacity
        if (minCapacity != null && minCapacity > 0) {
            resources = resources.stream()
                    .filter(r -> r.getCapacity() >= minCapacity)
                    .collect(Collectors.toList());
        }

        return resources;
    }

    /**
     * Create a new resource
     * @param dto the resource DTO
     * @return the created resource
     */
    public Resource createResource(ResourceDTO dto) {
        Resource resource = mapDTOToResource(dto);
        return resourceRepository.save(resource);
    }

    /**
     * Update an existing resource
     * @param id the resource ID
     * @param dto the updated resource DTO
     * @return the updated resource
     * @throws RuntimeException if resource is not found
     */
    public Resource updateResource(String id, ResourceDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        // Update fields from DTO
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityWindows(dto.getAvailabilityWindows());
        resource.setStatus(dto.getStatus());
        resource.setDescription(dto.getDescription());

        return resourceRepository.save(resource);
    }

    /**
     * Delete a resource by setting its status to OUT_OF_SERVICE
     * @param id the resource ID
     * @throws RuntimeException if resource is not found
     */
    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resource.setStatus("OUT_OF_SERVICE");
        resourceRepository.save(resource);
    }

    /**
     * Map ResourceDTO to Resource entity
     * @param dto the resource DTO
     * @return the resource entity
     */
    private Resource mapDTOToResource(ResourceDTO dto) {
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityWindows(dto.getAvailabilityWindows());
        resource.setStatus(dto.getStatus());
        resource.setDescription(dto.getDescription());
        return resource;
    }
}
