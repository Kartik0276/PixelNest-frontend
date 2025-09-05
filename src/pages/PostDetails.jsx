import React, { useState, useEffect, useCallback } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage,
  MDBCardTitle, MDBCardText, MDBBtn, MDBTextArea, MDBBadge
} from 'mdb-react-ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../../utils/api';
import Loader from '../components/Loader';
import CommentItem from '../components/CommentItem';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useToast } from '../components/ToastContainer';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchPostDetails = useCallback(async () => {
    try {
      // Use the new getPostById API for better performance
      const result = await postsAPI.getPostById(id);
      if (result.success && result.data.success) {
        setPost(result.data.post);
      } else {
        const errorMessage = result.data?.message || 'Failed to fetch post';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Fetch post error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  const fetchComments = useCallback(async () => {
    try {
      const result = await postsAPI.getComments(id);
      if (result.success && result.data.success) {
        setComments(result.data.comments || []);
      }
    } catch (err) {
      console.error('Fetch comments error:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [id, fetchPostDetails, fetchComments]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLikeLoading(true);
    try {
      const result = await postsAPI.toggleLike(id);
      if (result.success) {
        // Refresh post details
        fetchPostDetails();
      }
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const result = await postsAPI.addComment(id, { comment: newComment });
      if (result.success) {
        setNewComment('');
        fetchComments();
        fetchPostDetails(); // Refresh to update comment count
      } else {
        setError(result.data?.message || 'Failed to add comment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Add comment error:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentUpdate = () => {
    fetchComments();
    fetchPostDetails(); // Refresh to update comment count
  };

  const handleCommentDelete = () => {
    fetchComments();
    fetchPostDetails(); // Refresh to update comment count
  };

  const handleDeletePost = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await postsAPI.deletePost(id);
      if (result.success) {
        navigate('/myposts'); // Redirect to my posts after deletion
      } else {
        setError('Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('Delete post error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !post) {
    return (
      <MDBContainer className="py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <MDBBtn onClick={() => navigate('/')}>Back to Home</MDBBtn>
      </MDBContainer>
    );
  }

  if (!post) {
    return (
      <MDBContainer className="py-4">
        <div className="alert alert-warning" role="alert">
          Post not found
        </div>
        <MDBBtn onClick={() => navigate('/')}>Back to Home</MDBBtn>
      </MDBContainer>
    );
  }

  const isOwner = isAuthenticated && user && post.createdBy === user._id;
  const isLiked = isAuthenticated && user && post.likes?.includes(user._id);

  return (
    <MDBContainer className="py-4">
      <MDBRow>
        <MDBCol md="8" className="mx-auto">
          {/* Post Details */}
          <MDBCard className="mb-4 fade-in hover-glow">
            <MDBCardImage
              src={post.imageUrl}
              alt={post.title}
              position="top"
              style={{ height: '400px', objectFit: 'cover' }}
              className="image-hover"
            />
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <MDBCardTitle tag="h3">{post.title}</MDBCardTitle>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {/* Download button - available to all users */}
                  <MDBBtn
                    size="sm"
                    color="primary"
                    onClick={handleDownload}
                    className="btn-interactive ripple"
                    title="Download image"
                  >
                    <i className="fas fa-download icon-scale"></i>
                    <span className="d-none d-md-inline ms-1">Download</span>
                  </MDBBtn>

                  {isOwner && (
                    <>
                      <MDBBadge color="success" pill className="d-flex align-items-center">
                        <i className="fas fa-crown me-1"></i>
                        Your Post
                      </MDBBadge>
                      <div className="d-flex gap-2">
                        <MDBBtn
                          size="sm"
                          color="warning"
                          onClick={() => navigate(`/edit/${post._id}`)}
                          className="btn-interactive ripple"
                          title="Edit this post"
                        >
                          <i className="fas fa-edit icon-scale"></i>
                          <span className="d-none d-md-inline ms-1">Edit</span>
                        </MDBBtn>
                        <MDBBtn
                          size="sm"
                          color="danger"
                          onClick={handleDeletePost}
                          className="btn-interactive ripple delete-btn-prominent"
                          title="Delete this post permanently"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <i className="fas fa-spinner fa-spin icon-scale"></i>
                          ) : (
                            <i className="fas fa-trash-alt icon-scale"></i>
                          )}
                          <span className="d-none d-md-inline ms-1">
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </span>
                        </MDBBtn>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <MDBCardText className="mb-3">
                {post.description}
              </MDBCardText>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-muted">
                  By {post.createdBy?.name || 'Unknown'} • Posted on {formatDate(post.createdAt)}
                </small>
              </div>

              {/* Like and Comment Actions */}
              <div className="d-flex gap-3 mb-4">
                <MDBBtn
                  color={isLiked ? "danger" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={likeLoading || !isAuthenticated}
                  title={isLiked ? 'Unlike post' : 'Like post'}
                  className={`like-btn btn-interactive ripple ${isLiked ? 'liked' : ''} ${likeLoading ? 'pulse-animation' : ''}`}
                >
                  <i className={`${isLiked ? 'fas fa-heart' : 'far fa-heart'} me-1 icon-scale`}></i>
                  {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                </MDBBtn>

                <MDBBtn color="outline" size="sm" disabled>
                  <i className="far fa-comment me-1"></i>
                  {post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}
                </MDBBtn>
              </div>

              {/* Back Button */}
              <MDBBtn outline onClick={() => navigate(-1)} className="btn-interactive ripple slide-in-left">
                <i className="fas fa-arrow-left me-1 icon-scale"></i>
                Back
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>

          {/* Comments Section */}
          <MDBCard>
            <MDBCardBody>
              <h5 className="mb-4">Comments ({comments.length})</h5>

              {/* Add Comment Form */}
              {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="mb-4">
                  <MDBTextArea
                    label="Add a comment..."
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3 form-field-interactive glow-focus"
                  />
                  <MDBBtn
                    type="submit"
                    size="sm"
                    disabled={commentLoading || !newComment.trim()}
                    className={`btn-interactive ripple ${commentLoading ? 'pulse-animation' : ''}`}
                  >
                    <i className={`fas fa-plus me-1 icon-scale ${commentLoading ? 'rotate-loading' : ''}`}></i>
                    {commentLoading ? 'Adding...' : 'Add Comment'}
                  </MDBBtn>
                </form>
              ) : (
                <div className="alert alert-info mb-4">
                  <MDBBtn size="sm" onClick={() => navigate('/login')}>
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login to add comments
                  </MDBBtn>
                </div>
              )}

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
              ) : (
                <div>
                  {comments.map((comment, index) => (
                    <CommentItem
                      key={comment._id || index}
                      comment={comment}
                      postId={id}
                      onCommentUpdate={handleCommentUpdate}
                      onCommentDelete={handleCommentDelete}
                    />
                  ))}
                </div>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Mobile Floating Action Buttons */}
      <div className="floating-action-buttons d-md-none">
        {/* Download button - available to all users */}
{/*         <MDBBtn
          color="primary"
          floating
          size="lg"
          onClick={handleDownload}
          className="floating-btn download-btn mb-3"
          title="Download image"
        >
          <i className="fas fa-download"></i>
        </MDBBtn> */}

        {/* Owner-specific buttons */}
        {isOwner && (
          <>
            <MDBBtn
              color="warning"
              floating
              size="lg"
              onClick={() => navigate(`/edit/${post._id}`)}
              className="floating-btn edit-btn mb-3"
              title="Edit post"
            >
              <i className="fas fa-edit"></i>
            </MDBBtn>
            <MDBBtn
              color="danger"
              floating
              size="lg"
              onClick={handleDeletePost}
              className="floating-btn delete-btn-floating"
              title={isDeleting ? "Deleting post..." : "Delete post"}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-trash-alt"></i>
              )}
            </MDBBtn>
          </>
        )}
      </div>

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
    </MDBContainer>
  );
};

export default PostDetails;
