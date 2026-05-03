import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Clock3, MapPin, User, Tag, FileText } from 'lucide-react';
import type { IncidentTicket } from '../../types/ticket';
import { ticketService } from '../../services/ticketService';
import { commentService } from '../../services/commentService';
import { attachmentService } from '../../services/attachmentService';
import { getCurrentUser } from '../../services/apiClient';
import AssignTechnicianModal from '../../components/tickets/AssignTechnicianModal';
import UpdateStatusModal from '../../components/tickets/UpdateStatusModal';
import StatusBadge from '../../components/tickets/StatusBadge';
import AttachmentPreview from '../../components/tickets/AttachmentPreview';
import CommentSection from '../../components/tickets/CommentSection';
import '../../styles/tickets/tickets.css';

const TicketDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<IncidentTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'STAFF';

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
      <div className="ticket-detail-card">
        <div className="ticket-detail-header">
          <div className="ticket-detail-title">
            <div className="ticket-detail-icon">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="ticket-detail-label">Ticket</p>
              <h1>{ticket.ticketCode} - {ticket.title}</h1>
            </div>
          </div>
          <div className="ticket-detail-header-actions">
            {isAdmin && (
              <>
                <button
                  className="ticket-button primary"
                  onClick={() => setStatusOpen(true)}
                  type="button"
                >
                  Update Status
                </button>
                <button
                  className="ticket-button secondary"
                  onClick={() => setAssignOpen(true)}
                  type="button"
                >
                  Assign Technician
                </button>
              </>
            )}
            <StatusBadge status={ticket.status} priority={ticket.priority} />
          </div>
        </div>

        <p className="ticket-detail-description">{ticket.description}</p>

        <div className="ticket-detail-meta-grid">
          <span className="ticket-detail-chip"><Tag className="w-4 h-4" />{ticket.category}</span>
          <span className="ticket-detail-chip"><MapPin className="w-4 h-4" />{ticket.location}</span>
          <span className="ticket-detail-chip"><Clock3 className="w-4 h-4" />{new Date(ticket.createdAt).toLocaleString()}</span>
          <span className="ticket-detail-chip"><User className="w-4 h-4" />Assigned: {ticket.assignedTechnicianName || '-'}</span>
          <span className="ticket-detail-chip">Resource ID: {ticket.resourceId || '-'}</span>
          <span className="ticket-detail-chip">Contact: {ticket.preferredContactName} / {ticket.preferredContactEmail} / {ticket.preferredContactPhone || '-'}</span>
        </div>

        {ticket.rejectionReason && (
          <div className="message-banner error" style={{ marginTop: '1rem' }}>
            Rejection reason: {ticket.rejectionReason}
          </div>
        )}

        {ticket.resolutionNotes && (
          <div className="message-banner success" style={{ marginTop: '1rem' }}>
            Resolution notes: {ticket.resolutionNotes}
          </div>
        )}
      </div>

      <div className="ticket-detail-card" style={{ marginTop: '1rem' }}>
        <div className="section-heading">
          <h3>Attachments</h3>
        </div>
        <AttachmentPreview
          attachments={ticket.attachments}
          onDeleteAttachment={async (attachmentId) => {
            await attachmentService.deleteAttachment(ticket.id, attachmentId);
            await load();
          }}
        />
      </div>

      <div className="ticket-detail-card" style={{ marginTop: '1rem' }}>
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

      <AssignTechnicianModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        onConfirm={async (payload) => {
          if (!ticket) return;
          await ticketService.assignTechnician(ticket.id, payload);
          await load();
        }}
      />

      <UpdateStatusModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={async (payload) => {
          if (!ticket) return;
          await ticketService.updateStatus(ticket.id, payload);
          await load();
        }}
      />
    </div>
  );
};

export default TicketDetailsPage;
