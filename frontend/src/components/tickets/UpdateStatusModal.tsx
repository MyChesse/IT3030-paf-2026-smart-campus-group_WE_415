import React, { useState } from 'react';
import type { TicketStatus, UpdateStatusPayload } from '../../types/ticket';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: UpdateStatusPayload) => Promise<void>;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [status, setStatus] = useState<TicketStatus>('IN_PROGRESS');
  const [rejectionReason, setRejectionReason] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Update Status</h3>
        <div className="ticket-form">
          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)}>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {status === 'REJECTED' && (
            <div>
              <label>Rejection Reason</label>
              <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
            </div>
          )}

          {(status === 'RESOLVED' || status === 'CLOSED') && (
            <div>
              <label>Resolution Notes</label>
              <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} />
            </div>
          )}

          <div className="ticket-actions">
            <button
              className="ticket-button primary"
              onClick={async () => {
                await onConfirm({ status, rejectionReason, resolutionNotes });
                onClose();
              }}
            >
              Update
            </button>
            <button className="ticket-button secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
