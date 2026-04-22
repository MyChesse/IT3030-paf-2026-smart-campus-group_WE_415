package lk.sliit.it3030.smartcampus.ticket.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.ticket.attachments")
public class TicketAttachmentStorageProperties {

    private String uploadDir = "uploads/tickets";
    private long maxFileSize = 5 * 1024 * 1024;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }
}
