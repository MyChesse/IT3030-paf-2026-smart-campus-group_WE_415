package com.campus.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.campus.facility.entity.FacilityCategory;
import com.campus.facility.entity.FacilityItem;
import com.campus.facility.entity.FacilityUnit;
import com.campus.facility.repository.FacilityItemRepository;

@Component
public class FacilityCatalogSeeder {

    private final FacilityItemRepository facilityItemRepository;

    public FacilityCatalogSeeder(FacilityItemRepository facilityItemRepository) {
        this.facilityItemRepository = facilityItemRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedIfEmpty() {
        if (facilityItemRepository.count() > 0) {
            return;
        }

        seedLectureHalls();
        seedLabs();
        seedMeetingRooms();
        seedEquipment();
    }

    private void seedLectureHalls() {
        FacilityItem hallA = new FacilityItem(null, FacilityCategory.LECTURE_HALLS, "Hall A", "Main academic lecture hall block.", new java.util.ArrayList<>());
        hallA.addUnit(new FacilityUnit(null, "A-101", 120, true, true, true, hallA));
        hallA.addUnit(new FacilityUnit(null, "A-102", 90, true, false, true, hallA));
        hallA.addUnit(new FacilityUnit(null, "A-103", 80, true, true, false, "Maintenance scheduled for AV equipment.", hallA));
        facilityItemRepository.save(hallA);

        FacilityItem hallB = new FacilityItem(null, FacilityCategory.LECTURE_HALLS, "Hall B", "Lecture spaces close to engineering labs.", new java.util.ArrayList<>());
        hallB.addUnit(new FacilityUnit(null, "B-201", 140, true, true, true, hallB));
        hallB.addUnit(new FacilityUnit(null, "B-202", 110, true, false, true, hallB));
        facilityItemRepository.save(hallB);
    }

    private void seedLabs() {
        FacilityItem computerLabs = new FacilityItem(null, FacilityCategory.LABS, "Computer Labs", "Software and networking practical sessions.", new java.util.ArrayList<>());
        computerLabs.addUnit(new FacilityUnit(null, "CL-01", 45, true, false, true, computerLabs));
        computerLabs.addUnit(new FacilityUnit(null, "CL-02", 40, true, true, true, computerLabs));
        facilityItemRepository.save(computerLabs);

        FacilityItem scienceLabs = new FacilityItem(null, FacilityCategory.LABS, "Science Labs", "Physics and chemistry practical labs.", new java.util.ArrayList<>());
        scienceLabs.addUnit(new FacilityUnit(null, "SCI-11", 35, false, true, true, scienceLabs));
        facilityItemRepository.save(scienceLabs);
    }

    private void seedMeetingRooms() {
        FacilityItem meetingRooms = new FacilityItem(null, FacilityCategory.MEETING_ROOMS, "Faculty Meeting Rooms", "Comfortable rooms for planning and reviews.", new java.util.ArrayList<>());
        meetingRooms.addUnit(new FacilityUnit(null, "MR-301", 20, true, true, true, meetingRooms));
        meetingRooms.addUnit(new FacilityUnit(null, "MR-302", 14, true, false, true, meetingRooms));
        facilityItemRepository.save(meetingRooms);
    }

    private void seedEquipment() {
        FacilityItem projectors = new FacilityItem(null, FacilityCategory.EQUIPMENT, "Projectors", "Portable HD projectors for classes and events.", new java.util.ArrayList<>());
        projectors.addUnit(new FacilityUnit(null, "PJ-01", 1, true, false, true, projectors));
        projectors.addUnit(new FacilityUnit(null, "PJ-02", 1, true, false, false, "Checked out for an approved event.", projectors));
        facilityItemRepository.save(projectors);

        FacilityItem cameras = new FacilityItem(null, FacilityCategory.EQUIPMENT, "Cameras", "Recording and live-stream support cameras.", new java.util.ArrayList<>());
        cameras.addUnit(new FacilityUnit(null, "CAM-01", 1, false, true, true, cameras));
        facilityItemRepository.save(cameras);
    }
}
