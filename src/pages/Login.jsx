import React, { useState } from 'react';
import {
  MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBTypography
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        showSuccess('Login successful! Welcome back!');
        // Redirect to home or dashboard
        navigate('/');
      } else {
        showError(result.error || 'Login failed');
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      showError('Network error. Please try again.');
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard style={{ maxWidth: '500px', width: '100%' }} className="fade-in hover-glow">
        <MDBCardBody>
          <MDBTypography tag="h4" className="mb-4 text-center">Login</MDBTypography>

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Email"
              name="email"
              type="email"
              className="mb-4 form-field-interactive glow-focus slide-in-left"
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
              style={{animationDelay: '0.1s'}}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <MDBBtn
              type="submit"
              className={`w-100 mb-3 btn-interactive ripple ${loading ? 'pulse-animation' : ''}`}
              disabled={loading}
            >
              <i className={`fas fa-sign-in-alt me-1 icon-scale ${loading ? '' : ''}`}></i>
              {loading ? 'Logging in...' : 'Login'}
            </MDBBtn>
          </form>

          <p className="text-center">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
