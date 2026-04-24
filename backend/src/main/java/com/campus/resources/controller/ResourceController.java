package lk.sliit.it3030.smartcampus.resources.controller;

import jakarta.validation.Valid;
import lk.sliit.it3030.smartcampus.resources.entity.CampusResource;
import lk.sliit.it3030.smartcampus.resources.repository.CampusResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final CampusResourceRepository campusResourceRepository;

    public ResourceController(CampusResourceRepository campusResourceRepository) {
        this.campusResourceRepository = campusResourceRepository;
    }

    @GetMapping
    public ResponseEntity<List<CampusResource>> getAllResources(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean available
    ) {
        if (category != null && available != null) {
            return ResponseEntity.ok(campusResourceRepository.findByCategoryIgnoreCaseAndAvailable(category, available));
        }
        if (category != null) {
            return ResponseEntity.ok(campusResourceRepository.findByCategoryIgnoreCase(category));
        }
        if (available != null) {
            return ResponseEntity.ok(campusResourceRepository.findByAvailable(available));
        }
        return ResponseEntity.ok(campusResourceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampusResource> getResourceById(@PathVariable Long id) {
        CampusResource resource = campusResourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        return ResponseEntity.ok(resource);
    }

    @PostMapping
    public ResponseEntity<CampusResource> createResource(@Valid @RequestBody CampusResource resource) {
        return ResponseEntity.status(201).body(campusResourceRepository.save(resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampusResource> updateResource(@PathVariable Long id, @Valid @RequestBody CampusResource request) {
        CampusResource resource = campusResourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resource.setName(request.getName());
        resource.setCategory(request.getCategory());
        resource.setLocation(request.getLocation());
        resource.setDescription(request.getDescription());
        resource.setCapacity(request.getCapacity());
        resource.setAvailable(request.getAvailable());
        resource.setAmenities(request.getAmenities());
        resource.setImageUrl(request.getImageUrl());
        resource.setContactPerson(request.getContactPerson());

        return ResponseEntity.ok(campusResourceRepository.save(resource));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable Long id) {
        CampusResource resource = campusResourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        campusResourceRepository.delete(resource);
        return ResponseEntity.ok(Map.of("message", "Resource deleted successfully"));
    }
}
