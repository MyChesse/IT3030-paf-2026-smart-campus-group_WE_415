import React, { useState } from 'react';

interface ResolutionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => Promise<void>;
}

const ResolutionNotesModal: React.FC<ResolutionNotesModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Resolution Notes</h3>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="ticket-actions" style={{ marginTop: '0.8rem' }}>
          <button
            className="ticket-button primary"
            onClick={async () => {
              await onConfirm(notes);
              onClose();
            }}
          >
            Save Notes
          </button>
          <button className="ticket-button secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResolutionNotesModal;
