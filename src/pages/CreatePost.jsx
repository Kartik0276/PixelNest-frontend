import React, { useState } from 'react';
import {
  MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBTypography, MDBTextArea
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../utils/api';
import { useToast } from '../components/ToastContainer';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

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
      showError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      showError('Description is required');
      return false;
    }
    if (!formData.imageFile) {
      showError('Please select an image');
      return false;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(formData.imageFile.type)) {
      showError('Please select a valid image file (JPEG, PNG, WebP)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('imageFile', formData.imageFile);

      const result = await postsAPI.createPost(formDataToSend);

      if (result.success && result.data.success) {
        showSuccess('Post created successfully!');
        // Redirect to my posts page
        navigate('/myposts');
      } else {
        const errorMessage = result.data?.message || result.error || 'Failed to create post';
        showError(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      showError('Network error. Please try again.');
      setError('Network error. Please try again.');
      console.error('Create post error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <MDBCard>
            <MDBCardBody>
              <MDBTypography tag="h4" className="mb-4 text-center">Create New Post</MDBTypography>

              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <MDBInput
                  label="Title"
                  name="title"
                  type="text"
                  className="mb-4 form-field-interactive glow-focus"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <MDBTextArea
                  label="Description"
                  name="description"
                  rows={4}
                  className="mb-4 form-field-interactive glow-focus"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <div className="mb-4">
                  <label htmlFor="imageFile" className="form-label">Select Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="d-flex gap-2">
                  <MDBBtn
                    type="submit"
                    className={`flex-grow-1 btn-interactive ripple ${loading ? 'pulse-animation' : ''}`}
                    disabled={loading}
                  >
                    <i className={`fas fa-plus me-1 icon-scale ${loading ? 'rotate-loading' : ''}`}></i>
                    {loading ? 'Creating Post...' : 'Create Post'}
                  </MDBBtn>
                  <MDBBtn
                    type="button"
                    color="secondary"
                    onClick={() => navigate('/myposts')}
                    disabled={loading}
                    className="btn-interactive ripple"
                  >
                    <i className="fas fa-times me-1 icon-scale"></i>
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

export default CreatePost;
