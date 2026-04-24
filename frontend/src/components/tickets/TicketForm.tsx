import React, { useState } from 'react';
import type { CreateTicketPayload } from '../../types/ticket';
import AttachmentPreview from './AttachmentPreview';

interface TicketFormProps {
  onSubmit: (payload: CreateTicketPayload, files: File[]) => Promise<void>;
}

const initialData: CreateTicketPayload = {
  title: '',
  category: '',
  description: '',
  priority: 'MEDIUM',
  resourceId: undefined,
  location: '',
  preferredContactName: '',
  preferredContactEmail: '',
  preferredContactPhone: '',
};

const extractErrorMessage = (error: any) => {
  const responseData = error?.response?.data;

  if (responseData?.fieldErrors && typeof responseData.fieldErrors === 'object') {
    const fieldMessages = Object.values(responseData.fieldErrors).filter(Boolean) as string[];
    if (fieldMessages.length > 0) {
      return fieldMessages.join(' ');
    }
  }

  return responseData?.message || 'Failed to create ticket';
};

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
  const [data, setData] = useState<CreateTicketPayload>(initialData);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 3) {
      setError('Only up to 3 images are allowed.');
      return;
    }
    setFiles(selected);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(data, files);
      setData(initialData);
      setFiles([]);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ticket-form ticket-card" onSubmit={submit}>
      {error && <div className="message-banner error">{error}</div>}

      <div>
        <label>Title</label>
        <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} required />
      </div>

      <div className="ticket-form-row">
        <div>
          <label>Category</label>
          <input value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} required />
        </div>
        <div>
          <label>Priority</label>
          <select value={data.priority} onChange={(e) => setData({ ...data, priority: e.target.value as CreateTicketPayload['priority'] })}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          minLength={15}
          required
        />
      </div>

      <div className="ticket-form-row">
        <div>
          <label>Resource ID (optional)</label>
          <input
            type="number"
            value={data.resourceId || ''}
            onChange={(e) => setData({ ...data, resourceId: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div>
          <label>Location</label>
          <input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} required />
        </div>
      </div>

      <div className="ticket-form-row">
        <div>
          <label>Preferred Contact Name</label>
          <input
            value={data.preferredContactName}
            onChange={(e) => setData({ ...data, preferredContactName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Preferred Contact Email</label>
          <input
            type="email"
            value={data.preferredContactEmail}
            onChange={(e) => setData({ ...data, preferredContactEmail: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label>Preferred Contact Phone</label>
        <input
          value={data.preferredContactPhone || ''}
          onChange={(e) => setData({ ...data, preferredContactPhone: e.target.value })}
          maxLength={20}
        />
      </div>

      <div>
        <label>Attachments (up to 3 images)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} />
        <AttachmentPreview files={files} />
      </div>

      <button className="ticket-button primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Create Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;
