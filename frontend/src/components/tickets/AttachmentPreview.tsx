import React from 'react';
import type { TicketAttachment } from '../../types/ticket';

interface AttachmentPreviewProps {
  files?: File[];
  attachments?: TicketAttachment[];
  onDeleteAttachment?: (attachmentId: number) => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ files = [], attachments = [], onDeleteAttachment }) => {
  return (
    <div>
      {files.length > 0 && (
        <div className="ticket-upload-preview">
          {files.map((file) => (
            <div key={file.name}>
              <img src={URL.createObjectURL(file)} alt={file.name} />
              <small>{file.name}</small>
            </div>
          ))}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="ticket-upload-preview">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="ticket-card">
              <div><strong>{attachment.originalFileName}</strong></div>
              <small>{Math.round((attachment.fileSize / 1024) * 100) / 100} KB</small>
              {onDeleteAttachment && (
                <div className="ticket-actions" style={{ marginTop: '0.4rem' }}>
                  <button
                    className="ticket-button danger"
                    onClick={() => onDeleteAttachment(attachment.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentPreview;
