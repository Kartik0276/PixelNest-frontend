import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import pixelNestLogo from '../assets/PixelNest.png';

const Footer = () => {
  return (
    <MDBFooter className="footer bg-dark text-center text-lg-start text-muted">
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with me on social networks:</span>
        </div>

        <div>
          <a 
            href="https://www.linkedin.com/in/kartik-maity-268870258/" 
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <MDBIcon fab icon="linkedin" className="social-icon" />
          </a>
          <a 
            href="https://github.com/Kartik0276" 
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <MDBIcon fab icon="github" className="social-icon" />
          </a>
          <a 
            href="https://www.instagram.com/kaarrrttttiiikk/" 
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <MDBIcon fab icon="instagram" className="social-icon" />
          </a>
        </div>
      </section>

      <section>
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4 d-flex align-items-center">
                <img
                  src={pixelNestLogo}
                  alt="PixelNest Logo"
                  className="me-3 pixelnest-logo"
                />
                PixelNest
              </h6>
              <p>
                A beautiful platform to share and discover amazing images.
                Built with passion for photography and community.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Features</h6>
              <p>
                <a href="/" className="text-reset">
                  Browse PixelNest
                </a>
              </p>
              <p>
                <a href="/createPost" className="text-reset">
                  Upload Images
                </a>
              </p>
              <p>
                <a href="/myposts" className="text-reset">
                  My Posts
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Quick Links</h6>
              <p>
                <a href="/contact" className="text-reset">
                  Contact Us
                </a>
              </p>
              <p>
                <a href="/login" className="text-reset">
                  Login
                </a>
              </p>
              <p>
                <a href="/signup" className="text-reset">
                  Sign Up
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Connect</h6>
              <p>
                <MDBIcon fab icon="linkedin" className="me-3" />
                <a
                  href="https://www.linkedin.com/in/kartik-maity-268870258/"
                  className="text-reset"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Professional networking
                </a>
              </p>
              <p>
                <MDBIcon fab icon="github" className="me-3" />
                <a
                  href="https://github.com/Kartik0276"
                  className="text-reset"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Code & collaboration
                </a>
              </p>
              <p>
                <MDBIcon fab icon="instagram" className="me-3" />
                <a
                  href="https://www.instagram.com/kaarrrttttiiikk/"
                  className="text-reset"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow my journey
                </a>
              </p>
              <p>
                <MDBIcon icon="heart" className="me-3" />
                Built with passion
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <span>© 2025 All rights reserved by </span>
        <a className="text-reset fw-bold" href="https://github.com/Kartik0276">
          Kartik
        </a>
        <span> | Built with ❤️ for the community</span>
      </div>
    </MDBFooter>
  );
};

export default Footer;
