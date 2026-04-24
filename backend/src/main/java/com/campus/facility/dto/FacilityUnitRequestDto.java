package com.campus.facility.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FacilityUnitRequestDto(
        @NotBlank(message = "Unit name is required")
        String name,
        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        Integer capacity,
        boolean projector,
        boolean camera,
        boolean available,
        String unavailabilityReason
        ) {

}
