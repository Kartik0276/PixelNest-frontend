import React, { useState } from 'react';
import {
  MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBTypography
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showError('Name is required');
      return false;
    }
    if (formData.name.length < 2) {
      showError('Name must be at least 2 characters long');
      return false;
    }
    if (!formData.email.trim()) {
      showError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      showError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
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
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success && result.data.status === 'success') {
        showSuccess('Account created successfully! Redirecting to login...');
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage = result.data?.message || result.error || 'Failed to create account';
        showError(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      showError('Network error. Please try again.');
      setError('Network error. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard style={{ maxWidth: '500px', width: '100%' }} className="fade-in hover-glow">
        <MDBCardBody>
          <MDBTypography tag="h4" className="mb-4 text-center">Sign Up</MDBTypography>

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Full Name"
              name="name"
              type="text"
              className="mb-4 form-field-interactive glow-focus slide-in-left"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <MDBInput
              label="Email"
              name="email"
              type="email"
              className="mb-4 form-field-interactive glow-focus slide-in-left"
              style={{animationDelay: '0.1s'}}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <MDBInput
              label="Password"
              name="password"
              type="password"
              className="mb-4 form-field-interactive glow-focus slide-in-left"
              style={{animationDelay: '0.2s'}}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <MDBInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              className="mb-4 form-field-interactive glow-focus slide-in-left"
              style={{animationDelay: '0.3s'}}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <MDBBtn
              type="submit"
              className={`w-100 mb-3 btn-interactive ripple ${loading ? 'pulse-animation' : ''}`}
              disabled={loading}
            >
              <i className={`fas fa-user-plus me-1 icon-scale ${loading ? '' : ''}`}></i>
              {loading ? 'Creating Account...' : 'Register'}
            </MDBBtn>
          </form>

          <p className="text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default SignupPage;
