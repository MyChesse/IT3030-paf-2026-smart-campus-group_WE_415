package com.campus.facility.dto;

import jakarta.validation.constraints.NotBlank;

public record FacilityItemRequestDto(
        @NotBlank(message = "Facility item name is required")
        String name,
        String description
        ) {

}
