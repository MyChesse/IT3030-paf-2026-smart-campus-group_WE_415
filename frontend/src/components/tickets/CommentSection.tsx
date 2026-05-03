import React, { useState } from 'react';
import type { TicketComment } from '../../types/ticket';

interface CommentSectionProps {
  comments: TicketComment[];
  onAddComment: (text: string) => Promise<void>;
  onEditComment: (commentId: number, text: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment, onEditComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;
    await onAddComment(newComment.trim());
    setNewComment('');
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <form onSubmit={submit} className="ticket-actions" style={{ marginBottom: '0.8rem' }}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          style={{ flex: 1 }}
        />
        <button className="ticket-button primary" type="submit">Post</button>
      </form>

      <div className="ticket-comments">
        {comments.map((comment) => (
          <div className="ticket-comment-item" key={comment.id}>
            <div className="ticket-meta">
              <strong>{comment.authorName}</strong>
              <span>{comment.authorRole}</span>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>

            {editingId === comment.id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%' }}
                />
                <div className="ticket-actions">
                  <button
                    className="ticket-button primary"
                    onClick={async () => {
                      await onEditComment(comment.id, editingText);
                      setEditingId(null);
                    }}
                  >
                    Save
                  </button>
                  <button className="ticket-button secondary" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <p>{comment.commentText}</p>
            )}

            {comment.editableByCurrentUser && editingId !== comment.id && (
              <div className="ticket-actions">
                <button
                  className="ticket-button secondary"
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditingText(comment.commentText);
                  }}
                >
                  Edit
                </button>
                <button className="ticket-button danger" onClick={() => onDeleteComment(comment.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && <p>No comments yet.</p>}
      </div>
    </div>
  );
};

export default CommentSection;
