import React from 'react';
import { MDBSpinner, MDBContainer } from 'mdb-react-ui-kit';

const Loader = () => {
  return (
    <MDBContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <MDBSpinner role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
        <p className="text-muted">Loading...</p>
      </div>
    </MDBContainer>
  );
};

export default Loader;
