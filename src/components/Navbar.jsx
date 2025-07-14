import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBContainer,
  MDBBtn,
} from 'mdb-react-ui-kit';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './ToastContainer';
import pixelNestLogo from '../assets/PixelNest.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully!');
      navigate('/');
      setShowNavbar(false);
    } catch (error) {
      showError('Error logging out. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setShowNavbar(false);
  };

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <MDBNavbar expand="lg" dark fixed="top" className="navbar-dark-enhanced shadow-lg">
      <MDBContainer fluid>
        {/* Brand */}
        <MDBNavbarBrand href="/" className="d-flex align-items-center">
          <img
            src={pixelNestLogo}
            alt="PixelNest Logo"
            className="me-2 pixelnest-logo"
          />
          <div className="brand-text-dark">
            <strong className="text-light">PixelNest</strong>
          </div>
        </MDBNavbarBrand>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="navbar-toggler d-lg-none"
          aria-controls="navbarNav"
          aria-expanded={showNavbar}
          aria-label="Toggle navigation"
          onClick={handleToggle}
          style={{
            background: 'rgba(255, 193, 7, 0.15)',
            border: '1px solid rgba(255, 193, 7, 0.6)',
            borderRadius: '6px',
            padding: '0.5rem'
          }}
        >
          <i className={`fas ${showNavbar ? 'fa-times' : 'fa-bars'} text-warning`}></i>
        </button>

        {/* Collapsible Content */}
        <div className={`collapse navbar-collapse ${showNavbar ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" onClick={()=> handleNavClick('/')} className="nav-link text-light">
                <i className="fas fa-home me-2"></i>Home
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/myposts" onClick={()=> handleNavClick('/myposts')} className="nav-link text-light">
                    <i className="fas fa-folder-open me-2"></i>My Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/createPost" onClick={()=> handleNavClick('/createPost')} className="nav-link text-light">
                    <i className="fas fa-plus-circle me-2"></i>Create Post
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link to="/contact" onClick={()=> handleNavClick('/contact')} className="nav-link text-light">
                <i className="fas fa-envelope me-2"></i>Contact
              </Link>
            </li>
          </ul>

          {/* User Section */}
          <div className="d-flex align-items-center flex-column flex-lg-row">
            {isAuthenticated ? (
              <>
                <span className="text-light me-3 mb-2 mb-lg-0">
                  Welcome, <strong className="text-warning">{user?.name || 'User'}</strong>
                </span>
                <MDBBtn color="danger" size="sm" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </MDBBtn>
              </>
            ) : (
              <>
                <MDBBtn outline color="light" size="sm" onClick={() => handleNavClick('/login')} className="me-2 mb-2 mb-lg-0">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </MDBBtn>
                <MDBBtn color="warning" size="sm"  onClick={ () => handleNavClick('/signup') }>
                  <i className="fas fa-user-plus me-2"></i>Sign Up
                </MDBBtn>
              </>
            )}
          </div>
        </div>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Navbar;
