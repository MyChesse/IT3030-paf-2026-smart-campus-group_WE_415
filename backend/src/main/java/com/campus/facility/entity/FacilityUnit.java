package com.campus.facility.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "facility_units")
public class FacilityUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private boolean projector;

    @Column(nullable = false)
    private boolean camera;

    @Column(nullable = false)
    private boolean available;

    @Column(name = "unavailability_reason")
    private String unavailabilityReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private FacilityItem item;

    public FacilityUnit() {
    }

    public FacilityUnit(Long id, String name, Integer capacity, boolean projector, boolean camera, boolean available,
            FacilityItem item) {
        this(id, name, capacity, projector, camera, available, null, item);
    }

    public FacilityUnit(Long id, String name, Integer capacity, boolean projector, boolean camera, boolean available,
            String unavailabilityReason, FacilityItem item) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.projector = projector;
        this.camera = camera;
        this.available = available;
        this.unavailabilityReason = unavailabilityReason;
        this.item = item;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public boolean isProjector() {
        return projector;
    }

    public void setProjector(boolean projector) {
        this.projector = projector;
    }

    public boolean isCamera() {
        return camera;
    }

    public void setCamera(boolean camera) {
        this.camera = camera;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getUnavailabilityReason() {
        return unavailabilityReason;
    }

    public void setUnavailabilityReason(String unavailabilityReason) {
        this.unavailabilityReason = unavailabilityReason;
    }

    public FacilityItem getItem() {
        return item;
    }

    public void setItem(FacilityItem item) {
        this.item = item;
    }
}
