package com.campus.facility.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "facility_items")
public class FacilityItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityCategory category;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FacilityUnit> units = new ArrayList<>();

    public FacilityItem() {
    }

    public FacilityItem(Long id, FacilityCategory category, String name, String description, List<FacilityUnit> units) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.description = description;
        this.units = units != null ? units : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FacilityCategory getCategory() {
        return category;
    }

    public void setCategory(FacilityCategory category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<FacilityUnit> getUnits() {
        return units;
    }

    public void setUnits(List<FacilityUnit> units) {
        this.units = units != null ? units : new ArrayList<>();
    }

    public void addUnit(FacilityUnit unit) {
        units.add(unit);
        unit.setItem(this);
    }

    public void removeUnit(FacilityUnit unit) {
        units.remove(unit);
        unit.setItem(null);
    }
}
