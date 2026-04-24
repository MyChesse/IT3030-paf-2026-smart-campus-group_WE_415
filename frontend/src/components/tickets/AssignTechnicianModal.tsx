import React, { useState } from 'react';
import type { AssignTechnicianPayload } from '../../types/ticket';

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: AssignTechnicianPayload) => Promise<void>;
}

const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [assignedTechnicianId, setAssignedTechnicianId] = useState('');
  const [assignedTechnicianName, setAssignedTechnicianName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Assign Technician</h3>
        <div className="ticket-form">
          <div>
            <label>Technician ID</label>
            <input value={assignedTechnicianId} onChange={(e) => setAssignedTechnicianId(e.target.value)} />
          </div>
          <div>
            <label>Technician Name</label>
            <input value={assignedTechnicianName} onChange={(e) => setAssignedTechnicianName(e.target.value)} />
          </div>
          <div className="ticket-actions">
            <button
              className="ticket-button primary"
              onClick={async () => {
                await onConfirm({
                  assignedTechnicianId: Number(assignedTechnicianId),
                  assignedTechnicianName,
                });
                onClose();
              }}
            >
              Assign
            </button>
            <button className="ticket-button secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;
