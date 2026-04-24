package com.campus.resources.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
public class CampusResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String location;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Integer capacity = 1;

    @Column(nullable = false)
    private Boolean available = true;

    @ElementCollection
    @CollectionTable(name = "resource_amenities", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    private String imageUrl;
    private String contactPerson;
}
