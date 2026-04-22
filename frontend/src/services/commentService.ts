import apiClient from './apiClient';
import type { TicketComment } from '../types/ticket';

export const commentService = {
  async addComment(ticketId: number, commentText: string) {
    const response = await apiClient.post<TicketComment>(`/tickets/${ticketId}/comments`, { commentText });
    return response.data;
  },

  async updateComment(commentId: number, commentText: string) {
    const response = await apiClient.put<TicketComment>(`/tickets/comments/${commentId}`, { commentText });
    return response.data;
  },

  async deleteComment(commentId: number) {
    await apiClient.delete(`/tickets/comments/${commentId}`);
  },
};
