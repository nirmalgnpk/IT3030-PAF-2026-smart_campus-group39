package com.smartcampus.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ResourceDTO {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Type cannot be blank")
    private String type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    private String availabilityWindows;

    @NotBlank(message = "Status cannot be blank")
    private String status;

    private String description;

    public ResourceDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(String availabilityWindows) { this.availabilityWindows = availabilityWindows; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}