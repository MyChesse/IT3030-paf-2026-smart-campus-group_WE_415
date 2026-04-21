package lk.sliit.it3030.smartcampus.auth.repository;

import lk.sliit.it3030.smartcampus.auth.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
}
