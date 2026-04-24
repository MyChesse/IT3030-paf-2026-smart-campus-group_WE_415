import React, { useState } from 'react';
import TicketForm from '../../components/tickets/TicketForm';
import { ticketService } from '../../services/ticketService';
import '../../styles/tickets/tickets.css';

const CreateIncidentTicketPage: React.FC = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (payload: any, files: File[]) => {
    await ticketService.createTicket(payload, files);
    setMessage({ type: 'success', text: 'Incident ticket created successfully.' });
  };

  return (
    <div className="ticket-page">
      <div className="ticket-heading">
        <h2>Create Incident Ticket</h2>
        <p>Report operational issues with attachments and preferred contact details.</p>
      </div>
      {message && <div className={`message-banner ${message.type}`}>{message.text}</div>}
      <TicketForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateIncidentTicketPage;
