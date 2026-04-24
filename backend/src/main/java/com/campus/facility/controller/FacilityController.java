package com.campus.facility.controller;

import com.campus.facility.dto.FacilityCatalogResponseDto;
import com.campus.facility.dto.FacilityItemDto;
import com.campus.facility.dto.FacilityItemRequestDto;
import com.campus.facility.dto.FacilityUnitRequestDto;
import com.campus.facility.entity.FacilityCategory;
import com.campus.facility.service.FacilityCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    private final FacilityCatalogService facilityCatalogService;

    public FacilityController(FacilityCatalogService facilityCatalogService) {
        this.facilityCatalogService = facilityCatalogService;
    }

    @GetMapping("/catalog")
    public ResponseEntity<FacilityCatalogResponseDto> getCatalog() {
        return ResponseEntity.ok(facilityCatalogService.getCatalog());
    }

    @PostMapping("/{category}/items")
    public ResponseEntity<FacilityItemDto> createItem(
            @PathVariable FacilityCategory category,
            @Valid @RequestBody FacilityItemRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facilityCatalogService.createItem(category, request));
    }

    @PutMapping("/{category}/items/{itemId}")
    public ResponseEntity<FacilityItemDto> updateItem(
            @PathVariable FacilityCategory category,
            @PathVariable Long itemId,
            @Valid @RequestBody FacilityItemRequestDto request) {
        return ResponseEntity.ok(facilityCatalogService.updateItem(category, itemId, request));
    }

    @DeleteMapping("/{category}/items/{itemId}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable FacilityCategory category,
            @PathVariable Long itemId) {
        facilityCatalogService.deleteItem(category, itemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{category}/items/{itemId}/units")
    public ResponseEntity<FacilityItemDto> createUnit(
            @PathVariable FacilityCategory category,
            @PathVariable Long itemId,
            @Valid @RequestBody FacilityUnitRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facilityCatalogService.createUnit(category, itemId, request));
    }

    @PutMapping("/{category}/items/{itemId}/units/{unitId}")
    public ResponseEntity<FacilityItemDto> updateUnit(
            @PathVariable FacilityCategory category,
            @PathVariable Long itemId,
            @PathVariable Long unitId,
            @Valid @RequestBody FacilityUnitRequestDto request) {
        return ResponseEntity.ok(facilityCatalogService.updateUnit(category, itemId, unitId, request));
    }

    @DeleteMapping("/{category}/items/{itemId}/units/{unitId}")
    public ResponseEntity<Void> deleteUnit(
            @PathVariable FacilityCategory category,
            @PathVariable Long itemId,
            @PathVariable Long unitId) {
        facilityCatalogService.deleteUnit(category, itemId, unitId);
        return ResponseEntity.noContent().build();
    }
}
