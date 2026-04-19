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

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public List<Resource> searchResources(String type, String location, Integer minCapacity) {
        List<Resource> resources = resourceRepository.findAll();

        if (type != null && !type.isEmpty())
            resources = resources.stream()
                    .filter(r -> r.getType().equalsIgnoreCase(type)).collect(Collectors.toList());

        if (location != null && !location.isEmpty())
            resources = resources.stream()
                    .filter(r -> r.getLocation().equalsIgnoreCase(location)).collect(Collectors.toList());

        if (minCapacity != null && minCapacity > 0)
            resources = resources.stream()
                    .filter(r -> r.getCapacity() >= minCapacity).collect(Collectors.toList());

        return resources;
    }

    public Resource createResource(ResourceDTO dto) {
        return resourceRepository.save(mapDTOToResource(dto));
    }

    public Resource updateResource(String id, ResourceDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
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
     * Delete a resource from the database (hard delete)
     * @param id the resource ID
     * @throws RuntimeException if resource is not found
     */
    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resourceRepository.deleteById(id);
    }

    private Resource mapDTOToResource(ResourceDTO dto) {
        Resource r = new Resource();
        r.setName(dto.getName());
        r.setType(dto.getType());
        r.setCapacity(dto.getCapacity());
        r.setLocation(dto.getLocation());
        r.setAvailabilityWindows(dto.getAvailabilityWindows());
        r.setStatus(dto.getStatus());
        r.setDescription(dto.getDescription());
        return r;
    }
}