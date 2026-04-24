package com.campus.facility.dto;

import java.util.List;

public record FacilityCatalogResponseDto(
        List<FacilityItemDto> lectureHalls,
        List<FacilityItemDto> labs,
        List<FacilityItemDto> meetingRooms
                ) {

























}
