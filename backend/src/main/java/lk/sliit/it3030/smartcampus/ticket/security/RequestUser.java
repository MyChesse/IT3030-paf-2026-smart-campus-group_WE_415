package lk.sliit.it3030.smartcampus.ticket.security;

public record RequestUser(Long userId, UserRole role, String displayName) {

    public boolean isAdminLike() {
        return role == UserRole.ADMIN || role == UserRole.STAFF;
    }
}
