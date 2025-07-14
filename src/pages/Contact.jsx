import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useToast } from '../components/ToastContainer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    sendCopy: false
  });

  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    if (!formData.subject.trim()) {
      showError('Subject is required');
      return false;
    }
    if (!formData.message.trim()) {
      showError('Message is required');
      return false;
    }
    if (formData.message.length < 10) {
      showError('Message must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          sendCopy: false
        });
      } else {
        showError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="py-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="8" lg="6">
          <MDBCard className="fade-in hover-glow">
            <MDBCardBody className="p-5">
              <div className="text-center mb-4">
                <MDBIcon icon="envelope" size="3x" className="text-warning mb-3" />
                <MDBTypography tag="h2" className="mb-2">
                  Contact Us
                </MDBTypography>
                <MDBTypography tag="p" className="text-muted">
                  Have a question, suggestion, or found a bug? We'd love to hear from you!
                </MDBTypography>
              </div>

              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput
                      label="Your Name"
                      name="name"
                      type="text"
                      className="mb-4 form-field-interactive"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      label="Email Address"
                      name="email"
                      type="email"
                      className="mb-4 form-field-interactive"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBInput
                  label="Subject"
                  name="subject"
                  type="text"
                  className="mb-4 form-field-interactive"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="e.g., Bug Report, Feature Request, General Inquiry"
                />

                <MDBTextArea
                  label="Your Message"
                  name="message"
                  rows={6}
                  className="mb-4 form-field-interactive"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Please describe your question, suggestion, or issue in detail..."
                />

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="sendCopy"
                    id="sendCopy"
                    checked={formData.sendCopy}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label text-muted" htmlFor="sendCopy">
                    Send me a copy of this message
                  </label>
                </div>

                <MDBBtn
                  type="submit"
                  className="w-100 btn-interactive ripple"
                  size="lg"
                  disabled={loading}
                >
                  <MDBIcon 
                    icon={loading ? "spinner" : "paper-plane"} 
                    className={`me-2 ${loading ? "fa-spin" : ""}`} 
                  />
                  {loading ? 'Sending Message...' : 'Send Message'}
                </MDBBtn>
              </form>

              <div className="text-center mt-4">
                <MDBTypography tag="p" className="text-muted small">
                  You can also reach us through our social media channels in the footer below.
                </MDBTypography>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Contact Information Cards */}
      <MDBRow className="mt-5">
        <MDBCol md="4" className="mb-4">
          <MDBCard className="h-100 text-center hover-glow">
            <MDBCardBody>
              <MDBIcon fab icon="linkedin" size="2x" className="text-warning mb-3" />
              <MDBTypography tag="h5">Professional</MDBTypography>
              <MDBTypography tag="p" className="text-muted">
                Connect for business opportunities and networking
              </MDBTypography>
              <MDBBtn 
                outline 
                color="warning" 
                size="sm"
                href="https://www.linkedin.com/in/kartik-maity-268870258/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard className="h-100 text-center hover-glow">
            <MDBCardBody>
              <MDBIcon fab icon="github" size="2x" className="text-warning mb-3" />
              <MDBTypography tag="h5">Technical</MDBTypography>
              <MDBTypography tag="p" className="text-muted">
                Collaborate on code and discuss technical topics
              </MDBTypography>
              <MDBBtn 
                outline 
                color="warning" 
                size="sm"
                href="https://github.com/Kartik0276"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Profile
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard className="h-100 text-center hover-glow">
            <MDBCardBody>
              <MDBIcon fab icon="instagram" size="2x" className="text-warning mb-3" />
              <MDBTypography tag="h5">Personal</MDBTypography>
              <MDBTypography tag="p" className="text-muted">
                Follow my journey and personal updates
              </MDBTypography>
              <MDBBtn 
                outline 
                color="warning" 
                size="sm"
                href="https://www.instagram.com/kaarrrttttiiikk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram Profile
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Contact;
