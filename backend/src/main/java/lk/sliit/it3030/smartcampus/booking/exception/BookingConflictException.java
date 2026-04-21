package lk.sliit.it3030.smartcampus.booking.exception;

public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}