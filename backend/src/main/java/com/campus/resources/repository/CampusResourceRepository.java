package com.campus.resources.repository;

import com.campus.resources.entity.CampusResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampusResourceRepository extends JpaRepository<CampusResource, Long> {
    List<CampusResource> findByCategoryIgnoreCase(String category);
    List<CampusResource> findByAvailable(Boolean available);
    List<CampusResource> findByCategoryIgnoreCaseAndAvailable(String category, Boolean available);
}
