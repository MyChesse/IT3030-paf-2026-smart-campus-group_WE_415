export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TicketAttachment {
  id: number;
  originalFileName: string;
  fileType: string;
  fileSize: number;
}

export interface TicketComment {
  id: number;
  commentText: string;
  authorId: number;
  authorRole: 'USER' | 'ADMIN' | 'TECHNICIAN' | 'STAFF';
  authorName: string;
  createdAt: string;
  updatedAt: string;
  editableByCurrentUser: boolean;
}

export interface IncidentTicket {
  id: number;
  ticketCode: string;
  title: string;
  category: string;
  description: string;
  priority: TicketPriority;
  resourceId?: number;
  location: string;
  preferredContactName: string;
  preferredContactEmail: string;
  preferredContactPhone?: string;
  status: TicketStatus;
  rejectionReason?: string;
  resolutionNotes?: string;
  createdByUserId: number;
  assignedTechnicianId?: number;
  assignedTechnicianName?: string;
  createdAt: string;
  updatedAt: string;
  attachments: TicketAttachment[];
  comments: TicketComment[];
}

export interface CreateTicketPayload {
  title: string;
  category: string;
  description: string;
  priority: TicketPriority;
  resourceId?: number;
  location: string;
  preferredContactName: string;
  preferredContactEmail: string;
  preferredContactPhone?: string;
}

export interface UpdateStatusPayload {
  status: TicketStatus;
  rejectionReason?: string;
  resolutionNotes?: string;
}

export interface AssignTechnicianPayload {
  assignedTechnicianId: number;
  assignedTechnicianName: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assignedTechnician?: number;
  search?: string;
}
