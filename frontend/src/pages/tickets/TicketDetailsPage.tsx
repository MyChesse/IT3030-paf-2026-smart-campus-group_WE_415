import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { IncidentTicket } from '../../types/ticket';
import { ticketService } from '../../services/ticketService';
import { commentService } from '../../services/commentService';
import { attachmentService } from '../../services/attachmentService';
import StatusBadge from '../../components/tickets/StatusBadge';
import AttachmentPreview from '../../components/tickets/AttachmentPreview';
import CommentSection from '../../components/tickets/CommentSection';
import '../../styles/tickets/tickets.css';

const TicketDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<IncidentTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await ticketService.getTicketById(Number(id));
      setTicket(response);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <div className="ticket-page"><div className="ticket-card">Loading...</div></div>;
  if (error) return <div className="ticket-page"><div className="message-banner error">{error}</div></div>;
  if (!ticket) return <div className="ticket-page"><div className="ticket-card">Ticket not found.</div></div>;

  return (
    <div className="ticket-page">
      <div className="ticket-card">
        <div className="ticket-actions" style={{ justifyContent: 'space-between' }}>
          <h2>{ticket.ticketCode} - {ticket.title}</h2>
          <StatusBadge status={ticket.status} priority={ticket.priority} />
        </div>

        <p>{ticket.description}</p>
        <div className="ticket-meta">
          <span>Category: {ticket.category}</span>
          <span>Location: {ticket.location}</span>
          <span>Resource ID: {ticket.resourceId || '-'}</span>
          <span>Preferred Contact: {ticket.preferredContactName} / {ticket.preferredContactEmail} / {ticket.preferredContactPhone || '-'}</span>
          <span>Assigned: {ticket.assignedTechnicianName || '-'}</span>
        </div>

        {ticket.rejectionReason && (
          <div className="message-banner error" style={{ marginTop: '0.8rem' }}>
            Rejection reason: {ticket.rejectionReason}
          </div>
        )}

        {ticket.resolutionNotes && (
          <div className="message-banner success" style={{ marginTop: '0.8rem' }}>
            Resolution notes: {ticket.resolutionNotes}
          </div>
        )}
      </div>

      <div className="ticket-card" style={{ marginTop: '0.9rem' }}>
        <h3>Attachments</h3>
        <AttachmentPreview
          attachments={ticket.attachments}
          onDeleteAttachment={async (attachmentId) => {
            await attachmentService.deleteAttachment(ticket.id, attachmentId);
            await load();
          }}
        />
      </div>

      <div style={{ marginTop: '0.9rem' }}>
        <CommentSection
          comments={ticket.comments}
          onAddComment={async (text) => {
            await commentService.addComment(ticket.id, text);
            await load();
          }}
          onEditComment={async (commentId, text) => {
            await commentService.updateComment(commentId, text);
            await load();
          }}
          onDeleteComment={async (commentId) => {
            await commentService.deleteComment(commentId);
            await load();
          }}
        />
      </div>
    </div>
  );
};

export default TicketDetailsPage;
