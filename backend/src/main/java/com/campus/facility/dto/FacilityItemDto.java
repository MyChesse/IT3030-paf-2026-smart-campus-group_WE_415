package com.campus.facility.dto;

import java.util.List;

public record FacilityItemDto(
        Long id,
        String name,
        String description,
        List<FacilityUnitDto> units
                ) {

























}
