package com.campus.facility.dto;

public record FacilityUnitDto(
        Long id,
        String name,
        Integer capacity,
        boolean projector,
        boolean camera,
        boolean available,
        String unavailabilityReason
        ) {

}
