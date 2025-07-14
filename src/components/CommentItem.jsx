import React, { useState } from 'react';
import { MDBBtn, MDBTextArea } from 'mdb-react-ui-kit';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../../utils/api';

const CommentItem = ({ comment, postId, onCommentUpdate, onCommentDelete }) => {
  const { isAuthenticated, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [loading, setLoading] = useState(false);

  const isCommentOwner = isAuthenticated && user && comment.user?._id === user._id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(comment.text);
  };

  const handleSave = async () => {
    if (!editText.trim()) return;

    setLoading(true);
    try {
      const result = await postsAPI.editComment(postId, comment._id, { comment: editText });
      if (result.success) {
        setIsEditing(false);
        onCommentUpdate();
      } else {
        console.error('Failed to update comment');
      }
    } catch (error) {
      console.error('Update comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(comment.text);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const result = await postsAPI.deleteComment(postId, comment._id);
        if (result.success) {
          onCommentDelete();
        } else {
          console.error('Failed to delete comment');
        }
      } catch (error) {
        console.error('Delete comment error:', error);
      }
    }
  };

  return (
    <div className="border-bottom pb-3 mb-3 comment-item fade-in">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <strong className="text-primary">{comment.user?.name || 'Anonymous'}</strong>
            <small className="text-muted">
              {formatDate(comment.createdAt)}
              {comment.status === 'edited' && (
                <span className="ms-1 text-warning">(edited)</span>
              )}
            </small>
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <MDBTextArea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="mb-2 form-field-interactive glow-focus bounce-in"
                disabled={loading}
              />
              <div className="d-flex gap-2">
                <MDBBtn
                  size="sm"
                  color="success"
                  onClick={handleSave}
                  disabled={!editText.trim() || loading}
                  className={`btn-interactive ripple ${loading ? 'pulse-animation' : ''}`}
                >
                  <i className={`fas fa-check me-1 icon-scale ${loading ? 'rotate-loading' : ''}`}></i>
                  {loading ? 'Saving...' : 'Save'}
                </MDBBtn>
                <MDBBtn
                  size="sm"
                  color="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                  className="btn-interactive ripple"
                >
                  <i className="fas fa-times me-1 icon-scale"></i>
                  Cancel
                </MDBBtn>
              </div>
            </div>
          ) : (
            <p className="mb-1">{comment.text}</p>
          )}
        </div>
        
        {isCommentOwner && !isEditing && (
          <div className="d-flex gap-1 ms-2 slide-in-right">
            <MDBBtn
              size="sm"
              color="link"
              className="p-1 text-warning btn-interactive ripple"
              onClick={handleEdit}
              title="Edit comment"
            >
              <i className="fas fa-edit icon-scale"></i>
            </MDBBtn>
            <MDBBtn
              size="sm"
              color="link"
              className="p-1 text-danger btn-interactive ripple"
              onClick={handleDelete}
              title="Delete comment"
            >
              <i className="fas fa-trash icon-scale"></i>
            </MDBBtn>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
