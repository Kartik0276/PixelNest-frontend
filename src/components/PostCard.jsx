import React, { useState } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBBadge,
  MDBCol
} from 'mdb-react-ui-kit';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../utils/api';
import DeleteConfirmModal from './DeleteConfirmModal';
import { useToast } from './ToastContainer';

const PostCard = ({ post, onPostUpdate, showActions = false }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showSuccess, showError } = useToast();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show action buttons only when showActions prop is true and user is authenticated
  const isOwner = showActions && isAuthenticated && user;
  const isLiked = isAuthenticated && user && post.likes?.includes(user._id);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsLiking(true);
    try {
      const result = await postsAPI.toggleLike(post._id);
      if (result.success && onPostUpdate) {
        onPostUpdate(); // Refresh the posts
      }
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleViewPost = () => {
    navigate(`/post/${post._id}`);
  };

  const handleEdit = () => {
    navigate(`/edit/${post._id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDownload = async () => {
    try {
      // Create a temporary anchor element to trigger download
      const response = await fetch(post.imageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;

      // Generate filename from post title or use default
      const filename = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_image.jpg`;
      link.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);

      // Show success toast
      showSuccess('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      showError('Failed to download image. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await postsAPI.deletePost(post._id);
      if (result.success) {
        setShowDeleteModal(false);
        showSuccess('Post deleted successfully!');
        if (onPostUpdate) {
          onPostUpdate(); // Refresh the posts
        }
      } else {
        showError('Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <MDBCol md="6" lg="4" className="mb-4 fade-in stagger-item">
      <MDBCard className="h-100 interactive-card hover-glow">
      <MDBCardImage
        src={post.imageUrl}
        alt={post.title}
        position="top"
        style={{
          maxHeight: '300px',
          minHeight: '200px',
          width: '100%',
          objectFit: 'contain'
        }}
        className="image-hover"
        onClick={handleViewPost}
      />
      <MDBCardBody className="d-flex flex-column">
        <MDBCardTitle>{post.title}</MDBCardTitle>
        <MDBCardText className="flex-grow-1">
          {post.description}
        </MDBCardText>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              By {post.createdBy?.name || 'Unknown'} • {formatDate(post.createdAt)}
            </small>
            {isOwner && (
              <MDBBadge color="primary" pill>
                Your Post
              </MDBBadge>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <MDBBtn
                color="link"
                size="sm"
                className={`p-0 me-3 like-btn ${isLiked ? 'text-danger liked' : 'text-muted'} ${isLiking ? 'pulse-animation' : ''}`}
                onClick={handleLike}
                disabled={isLiking}
                title={isLiked ? 'Unlike post' : 'Like post'}
              >
                <i className={`${isLiked ? 'fas fa-heart' : 'far fa-heart'} me-1 icon-scale`}></i>
                {post.likes?.length || 0}
              </MDBBtn>
              <MDBBtn
                color="link"
                size="sm"
                className="p-0 text-muted btn-interactive"
                onClick={handleViewPost}
                title="View comments"
              >
                <i className="far fa-comment me-1 icon-scale"></i>
                {post.comments?.length || 0}
              </MDBBtn>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-1">
              {/* Download button - available to all users */}
              <MDBBtn
                color="link"
                size="sm"
                onClick={handleDownload}
                title="Download image"
                className="p-1 text-muted btn-no-bg"
              >
                <i className="fas fa-download" style={{ fontSize: '14px' }}></i>
              </MDBBtn>

              {isOwner && (
                <>
                  <MDBBtn
                    color="link"
                    size="sm"
                    onClick={handleEdit}
                    title="Edit this post"
                    className="p-1 text-muted btn-no-bg"
                  >
                    <i className="fas fa-edit" style={{ fontSize: '14px' }}></i>
                  </MDBBtn>
                  <MDBBtn
                    color="link"
                    size="sm"
                    onClick={handleDeleteClick}
                    title="Delete this post permanently"
                    className="p-1 text-muted btn-no-bg"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <i className="fas fa-spinner fa-spin" style={{ fontSize: '14px' }}></i>
                    ) : (
                      <i className="fas fa-trash-alt" style={{ fontSize: '14px' }}></i>
                    )}
                  </MDBBtn>
                </>
              )}
            </div>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>

    {/* Delete Confirmation Modal */}
    <DeleteConfirmModal
      isOpen={showDeleteModal}
      onClose={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
      title="Delete Post"
      itemName={post.title}
      itemType="post"
      details={[
        `The post and its image`,
        `All comments (${post.comments?.length || 0})`,
        `All likes (${post.likes?.length || 0})`
      ]}
      isDeleting={isDeleting}
    />
    </MDBCol>
  );
};

export default PostCard;
