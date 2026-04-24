package com.campus.facility.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.facility.dto.FacilityCatalogResponseDto;
import com.campus.facility.dto.FacilityItemDto;
import com.campus.facility.dto.FacilityItemRequestDto;
import com.campus.facility.dto.FacilityUnitDto;
import com.campus.facility.dto.FacilityUnitRequestDto;
import com.campus.facility.entity.FacilityCategory;
import com.campus.facility.entity.FacilityItem;
import com.campus.facility.entity.FacilityUnit;
import com.campus.facility.exception.FacilityNotFoundException;
import com.campus.facility.repository.FacilityItemRepository;
import com.campus.facility.repository.FacilityUnitRepository;

@Service
public class FacilityCatalogService {

    private final FacilityItemRepository facilityItemRepository;
    private final FacilityUnitRepository facilityUnitRepository;

    public FacilityCatalogService(FacilityItemRepository facilityItemRepository,
            FacilityUnitRepository facilityUnitRepository) {
        this.facilityItemRepository = facilityItemRepository;
        this.facilityUnitRepository = facilityUnitRepository;
    }

    public FacilityCatalogResponseDto getCatalog() {
        return new FacilityCatalogResponseDto(
                toItemDtos(facilityItemRepository.findByCategory(FacilityCategory.LECTURE_HALLS)),
                toItemDtos(facilityItemRepository.findByCategory(FacilityCategory.LABS)),
                toItemDtos(facilityItemRepository.findByCategory(FacilityCategory.MEETING_ROOMS))
        );
    }

    @Transactional
    public FacilityItemDto createItem(FacilityCategory category, FacilityItemRequestDto request) {
        FacilityItem item = new FacilityItem();
        item.setCategory(category);
        item.setName(request.name());
        item.setDescription(request.description());
        return toItemDto(facilityItemRepository.save(item));
    }

    @Transactional
    public FacilityItemDto updateItem(FacilityCategory category, Long itemId, FacilityItemRequestDto request) {
        FacilityItem item = findItem(itemId, category);
        item.setName(request.name());
        item.setDescription(request.description());
        return toItemDto(facilityItemRepository.save(item));
    }

    @Transactional
    public void deleteItem(FacilityCategory category, Long itemId) {
        FacilityItem item = findItem(itemId, category);
        facilityItemRepository.delete(item);
    }

    @Transactional
    public FacilityItemDto createUnit(FacilityCategory category, Long itemId, FacilityUnitRequestDto request) {
        FacilityItem item = findItem(itemId, category);
        FacilityUnit unit = new FacilityUnit();
        unit.setName(request.name());
        unit.setCapacity(request.capacity());
        unit.setProjector(request.projector());
        unit.setCamera(request.camera());
        unit.setAvailable(request.available());
        unit.setUnavailabilityReason(resolveReason(request.available(), request.unavailabilityReason()));
        item.addUnit(unit);
        facilityItemRepository.save(item);
        return toItemDto(item);
    }

    @Transactional
    public FacilityItemDto updateUnit(FacilityCategory category, Long itemId, Long unitId, FacilityUnitRequestDto request) {
        FacilityItem item = findItem(itemId, category);
        FacilityUnit unit = item.getUnits().stream()
                .filter(entry -> entry.getId().equals(unitId))
                .findFirst()
                .orElseThrow(() -> new FacilityNotFoundException("Facility unit not found"));

        unit.setName(request.name());
        unit.setCapacity(request.capacity());
        unit.setProjector(request.projector());
        unit.setCamera(request.camera());
        unit.setAvailable(request.available());
        unit.setUnavailabilityReason(resolveReason(request.available(), request.unavailabilityReason()));

        facilityUnitRepository.save(unit);
        return toItemDto(item);
    }

    @Transactional
    public void deleteUnit(FacilityCategory category, Long itemId, Long unitId) {
        FacilityItem item = findItem(itemId, category);
        FacilityUnit unit = item.getUnits().stream()
                .filter(entry -> entry.getId().equals(unitId))
                .findFirst()
                .orElseThrow(() -> new FacilityNotFoundException("Facility unit not found"));

        item.removeUnit(unit);
        facilityItemRepository.save(item);
    }

    private FacilityItem findItem(Long itemId, FacilityCategory category) {
        return facilityItemRepository.findByIdAndCategory(itemId, category)
                .orElseThrow(() -> new FacilityNotFoundException("Facility item not found"));
    }

    private List<FacilityItemDto> toItemDtos(List<FacilityItem> items) {
        return items.stream().map(this::toItemDto).toList();
    }

    private FacilityItemDto toItemDto(FacilityItem item) {
        return new FacilityItemDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getUnits().stream().map(this::toUnitDto).toList()
        );
    }

    private FacilityUnitDto toUnitDto(FacilityUnit unit) {
        return new FacilityUnitDto(
                unit.getId(),
                unit.getName(),
                unit.getCapacity(),
                unit.isProjector(),
                unit.isCamera(),
                unit.isAvailable(),
                unit.getUnavailabilityReason()
        );
    }

    private String resolveReason(boolean available, String reason) {
        if (available) {
            return null;
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Unavailability reason is required when a unit is unavailable");
        }

        return reason.trim();
    }
}
