package lk.sliit.it3030.smartcampus.ticket.security;

import lk.sliit.it3030.smartcampus.ticket.exception.ForbiddenActionException;
import org.springframework.stereotype.Component;

@Component
public class RequestUserResolver {

    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_ROLE_HEADER = "X-User-Role";
    public static final String USER_NAME_HEADER = "X-User-Name";

    public RequestUser resolve(String userIdHeader, String userRoleHeader, String userNameHeader) {
        Long userId = parseUserId(userIdHeader);
        UserRole role = parseRole(userRoleHeader);
        String displayName = (userNameHeader == null || userNameHeader.isBlank()) ? ("User-" + userId) : userNameHeader.trim();
        return new RequestUser(userId, role, displayName);
    }

    private Long parseUserId(String userIdHeader) {
        if (userIdHeader == null || userIdHeader.isBlank()) {
            // Keeps compatibility with the existing project's hardcoded user mode.
            return 1L;
        }
        try {
            return Long.parseLong(userIdHeader);
        } catch (NumberFormatException ex) {
            throw new ForbiddenActionException("Invalid X-User-Id header value");
        }
    }

    private UserRole parseRole(String userRoleHeader) {
        if (userRoleHeader == null || userRoleHeader.isBlank()) {
            return UserRole.USER;
        }
        try {
            return UserRole.valueOf(userRoleHeader.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ForbiddenActionException("Invalid X-User-Role header value");
        }
    }
}
