package com.campus.facility.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.facility.entity.FacilityCategory;
import com.campus.facility.entity.FacilityItem;

public interface FacilityItemRepository extends JpaRepository<FacilityItem, Long> {

    List<FacilityItem> findByCategory(FacilityCategory category);

    Optional<FacilityItem> findByIdAndCategory(Long id, FacilityCategory category);
}
