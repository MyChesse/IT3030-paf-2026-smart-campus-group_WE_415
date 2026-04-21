package lk.sliit.it3030.smartcampus.resources.repository;

import lk.sliit.it3030.smartcampus.resources.entity.CampusResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampusResourceRepository extends JpaRepository<CampusResource, Long> {
    List<CampusResource> findByCategoryIgnoreCase(String category);
    List<CampusResource> findByAvailable(Boolean available);
    List<CampusResource> findByCategoryIgnoreCaseAndAvailable(String category, Boolean available);
}
