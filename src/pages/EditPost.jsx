import React, { useState, useEffect, useCallback } from 'react';
import {
  MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBTypography, MDBTextArea
} from 'mdb-react-ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../../utils/api';
import Loader from '../components/Loader';
import { useToast } from '../components/ToastContainer';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null
  });

  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      // Get specific post by ID
      const result = await postsAPI.getPostById(id);
      if (result.success && result.data.success) {
        const post = result.data.post;
        const isOwner = result.data.isOwner;

        if (!isOwner) {
          const errorMessage = 'You can only edit your own posts';
          showError(errorMessage);
          setError(errorMessage);
          return;
        }

        setCurrentPost(post);
        setFormData({
          title: post.title,
          description: post.description,
          imageFile: null
        });
      } else {
        const errorMessage = result.data?.message || 'Failed to fetch post';
        showError(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      showError(errorMessage);
      setError(errorMessage);
      console.error('Fetch post error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleChange = (e) => {
    if (e.target.name === 'imageFile') {
      setFormData(prev => ({
        ...prev,
        imageFile: e.target.files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      const errorMessage = 'Title is required';
      showError(errorMessage);
      setError(errorMessage);
      return false;
    }
    if (!formData.description.trim()) {
      const errorMessage = 'Description is required';
      showError(errorMessage);
      setError(errorMessage);
      return false;
    }

    // Check file type if new image is selected
    if (formData.imageFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(formData.imageFile.type)) {
        const errorMessage = 'Please select a valid image file (JPEG, PNG, WebP)';
        showError(errorMessage);
        setError(errorMessage);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.imageFile) {
        formDataToSend.append('imageFile', formData.imageFile);
      }

      const result = await postsAPI.editPost(id, formDataToSend);

      if (result.success && result.data.success) {
        showSuccess('Post updated successfully!');
        // Redirect to post details or my posts
        navigate(`/post/${id}`);
      } else {
        const errorMessage = result.data?.message || result.error || 'Failed to update post';
        showError(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      showError(errorMessage);
      setError(errorMessage);
      console.error('Edit post error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !currentPost) {
    return (
      <MDBContainer className="py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <MDBBtn onClick={() => navigate('/myposts')}>Back to My Posts</MDBBtn>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <MDBCard>
            <MDBCardBody>
              <MDBTypography tag="h4" className="mb-4 text-center">Edit Post</MDBTypography>

              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}

              {/* Current Image Preview */}
              {currentPost && (
                <div className="mb-4">
                  <label className="form-label">Current Image:</label>
                  <img
                    src={currentPost.imageUrl}
                    alt={currentPost.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <MDBInput
                  label="Title"
                  name="title"
                  type="text"
                  className="mb-4"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={submitLoading}
                />

                <MDBTextArea
                  label="Description"
                  name="description"
                  rows={4}
                  className="mb-4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={submitLoading}
                />

                <div className="mb-4">
                  <label htmlFor="imageFile" className="form-label">
                    Change Image (optional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={submitLoading}
                  />
                  <small className="text-muted">
                    Leave empty to keep current image
                  </small>
                </div>

                <div className="d-flex gap-2">
                  <MDBBtn
                    type="submit"
                    className="flex-grow-1"
                    disabled={submitLoading}
                  >
                    <i className="fas fa-save me-1"></i>
                    {submitLoading ? 'Updating Post...' : 'Update Post'}
                  </MDBBtn>
                  <MDBBtn
                    type="button"
                    color="secondary"
                    onClick={() => navigate(`/post/${id}`)}
                    disabled={submitLoading}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancel
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
    </MDBContainer>
  );
};

export default EditPost;
