package lk.sliit.it3030.smartcampus.booking.exception;

import lk.sliit.it3030.smartcampus.ticket.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> error = baseError(HttpStatus.BAD_REQUEST, "Validation Failed", "Request validation failed");
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        error.put("fieldErrors", fieldErrors);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(BookingConflictException ex) {
        Map<String, Object> error = baseError(HttpStatus.CONFLICT, "Booking Conflict", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({TicketNotFoundException.class, CommentNotFoundException.class})
    public ResponseEntity<Map<String, Object>> handleNotFound(RuntimeException ex) {
        Map<String, Object> error = baseError(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ForbiddenActionException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(ForbiddenActionException ex) {
        Map<String, Object> error = baseError(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({InvalidTicketOperationException.class, FileValidationException.class})
    public ResponseEntity<Map<String, Object>> handleBadRequest(RuntimeException ex) {
        Map<String, Object> error = baseError(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> error = baseError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private Map<String, Object> baseError(HttpStatus status, String errorLabel, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", status.value());
        error.put("error", errorLabel);
        error.put("message", message);
        return error;
    }
}