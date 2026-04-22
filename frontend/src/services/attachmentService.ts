import apiClient from './apiClient';

export const attachmentService = {
  async deleteAttachment(ticketId: number, attachmentId: number) {
    await apiClient.delete(`/tickets/${ticketId}/attachments/${attachmentId}`);
  },
};
