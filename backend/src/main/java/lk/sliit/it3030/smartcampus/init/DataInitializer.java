package lk.sliit.it3030.smartcampus.init;

import jakarta.annotation.PostConstruct;
import lk.sliit.it3030.smartcampus.auth.entity.AppUser;
import lk.sliit.it3030.smartcampus.auth.repository.AppUserRepository;
import lk.sliit.it3030.smartcampus.notifications.entity.AppNotification;
import lk.sliit.it3030.smartcampus.notifications.repository.AppNotificationRepository;
import lk.sliit.it3030.smartcampus.resources.entity.CampusResource;
import lk.sliit.it3030.smartcampus.resources.repository.CampusResourceRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class DataInitializer {

    private final AppUserRepository appUserRepository;
    private final CampusResourceRepository campusResourceRepository;
    private final AppNotificationRepository appNotificationRepository;

    public DataInitializer(
            AppUserRepository appUserRepository,
            CampusResourceRepository campusResourceRepository,
            AppNotificationRepository appNotificationRepository
    ) {
        this.appUserRepository = appUserRepository;
        this.campusResourceRepository = campusResourceRepository;
        this.appNotificationRepository = appNotificationRepository;
    }

    @PostConstruct
    public void init() {
        if (appUserRepository.count() == 0) {
            AppUser admin = new AppUser();
            admin.setName("Admin User");
            admin.setEmail("admin@smartuni.com");
            admin.setPassword("admin123");
            admin.setRoles(Set.of("ADMIN"));
            appUserRepository.save(admin);

            AppUser tech = new AppUser();
            tech.setName("Tech User");
            tech.setEmail("tech@smartuni.com");
            tech.setPassword("tech12345");
            tech.setRoles(Set.of("TECHNICIAN"));
            appUserRepository.save(tech);

            AppUser user = new AppUser();
            user.setName("Student User");
            user.setEmail("user@smartuni.com");
            user.setPassword("user12345");
            user.setRoles(Set.of("USER"));
            appUserRepository.save(user);
        }

        if (campusResourceRepository.count() == 0) {
            CampusResource lab = new CampusResource();
            lab.setName("Computer Lab 01");
            lab.setCategory("LAB");
            lab.setLocation("Block A");
            lab.setDescription("High performance computer lab");
            lab.setCapacity(40);
            lab.setAvailable(true);
            lab.setAmenities(List.of("Projector", "AC", "WiFi"));
            lab.setContactPerson("Lab Assistant");
            campusResourceRepository.save(lab);

            CampusResource hall = new CampusResource();
            hall.setName("Conference Hall");
            hall.setCategory("HALL");
            hall.setLocation("Main Building");
            hall.setDescription("Large event hall for seminars");
            hall.setCapacity(200);
            hall.setAvailable(true);
            hall.setAmenities(List.of("PA System", "Stage", "Projector"));
            hall.setContactPerson("Admin Office");
            campusResourceRepository.save(hall);
        }

        if (appNotificationRepository.count() == 0) {
            AppNotification notification = new AppNotification();
            notification.setUserId(1L);
            notification.setType("BOOKING_APPROVED");
            notification.setTitle("Booking Approved");
            notification.setMessage("Your booking request has been approved.");
            notification.setRead(false);
            appNotificationRepository.save(notification);
        }
    }
}
