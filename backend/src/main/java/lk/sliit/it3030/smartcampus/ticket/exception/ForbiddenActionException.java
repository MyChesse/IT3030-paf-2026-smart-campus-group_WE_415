package lk.sliit.it3030.smartcampus.ticket.exception;

public class ForbiddenActionException extends RuntimeException {
    public ForbiddenActionException(String message) {
        super(message);
    }
}
