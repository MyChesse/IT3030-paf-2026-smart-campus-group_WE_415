package lk.sliit.it3030.smartcampus.ticket.service;

import lk.sliit.it3030.smartcampus.ticket.config.TicketAttachmentStorageProperties;
import lk.sliit.it3030.smartcampus.ticket.exception.FileValidationException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class TicketAttachmentStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final Path uploadPath;
    private final long maxFileSize;

    public TicketAttachmentStorageService(TicketAttachmentStorageProperties properties) {
        this.uploadPath = Paths.get(properties.getUploadDir()).toAbsolutePath().normalize();
        this.maxFileSize = properties.getMaxFileSize();
        createUploadDirectory();
    }

    public void validateAttachments(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return;
        }
        if (files.size() > 3) {
            throw new FileValidationException("Maximum 3 attachments are allowed per ticket");
        }

        for (MultipartFile file : files) {
            validateSingleFile(file);
        }
    }

    public StoredFileDetails storeFile(MultipartFile file) {
        validateSingleFile(file);

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename());
        String fileExtension = getExtension(originalFileName);
        String storedFileName = UUID.randomUUID() + (fileExtension.isBlank() ? "" : "." + fileExtension);
        Path target = uploadPath.resolve(storedFileName).normalize();

        if (!target.startsWith(uploadPath)) {
            throw new FileValidationException("Invalid file path");
        }

        try (InputStream input = file.getInputStream()) {
            Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING);
            return new StoredFileDetails(
                    originalFileName,
                    storedFileName,
                    file.getContentType(),
                    target.toString(),
                    file.getSize()
            );
        } catch (IOException ex) {
            throw new FileValidationException("Failed to store attachment: " + ex.getMessage());
        }
    }

    public void deleteFileIfExists(String absolutePath) {
        if (absolutePath == null || absolutePath.isBlank()) {
            return;
        }
        try {
            Path target = Paths.get(absolutePath).normalize();
            if (target.startsWith(uploadPath)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ex) {
            throw new FileValidationException("Failed to delete attachment from storage");
        }
    }

    private void validateSingleFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileValidationException("Attachment file cannot be empty");
        }
        if (file.getSize() > maxFileSize) {
            throw new FileValidationException("Attachment file size exceeds max limit of 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new FileValidationException("Only image attachments (jpg, jpeg, png, webp) are allowed");
        }
    }

    private String getExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot == -1 || lastDot == fileName.length() - 1) {
            return "";
        }
        String ext = fileName.substring(lastDot + 1).toLowerCase();
        if ("jpeg".equals(ext) || "jpg".equals(ext) || "png".equals(ext) || "webp".equals(ext)) {
            return ext;
        }
        throw new FileValidationException("Unsupported attachment extension");
    }

    private void createUploadDirectory() {
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not create attachment upload directory", ex);
        }
    }

    public record StoredFileDetails(
            String originalFileName,
            String storedFileName,
            String fileType,
            String filePath,
            Long fileSize
    ) {
    }
}
