import React from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  itemName, 
  itemType = "item",
  details = [],
  isDeleting = false 
}) => {
  return (
    <MDBModal open={isOpen} onClose={onClose} tabIndex='-1'>
      <MDBModalDialog centered>
        <MDBModalContent className="fade-in">
          <MDBModalHeader className="bg-danger text-white">
            <MDBModalTitle>
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirm Deletion
            </MDBModalTitle>
            <MDBBtn 
              className='btn-close btn-close-white' 
              color='none' 
              onClick={onClose}
              disabled={isDeleting}
            ></MDBBtn>
          </MDBModalHeader>
          
          <MDBModalBody className="p-4">
            <div className="text-center mb-4">
              <div className="text-danger mb-3">
                <i className="fas fa-trash-alt" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="mb-3">
                Are you sure you want to delete this {itemType}?
              </h5>
              {itemName && (
                <div className="alert alert-light border">
                  <strong>"{itemName}"</strong>
                </div>
              )}
            </div>
            
            {details.length > 0 && (
              <div className="mb-4">
                <h6 className="text-warning mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  This will permanently remove:
                </h6>
                <ul className="list-unstyled">
                  {details.map((detail, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-times text-danger me-2"></i>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Warning:</strong> This action cannot be undone!
            </div>
          </MDBModalBody>
          
          <MDBModalFooter>
            <MDBBtn 
              color='secondary' 
              onClick={onClose}
              disabled={isDeleting}
              className="btn-interactive"
            >
              <i className="fas fa-times me-1"></i>
              Cancel
            </MDBBtn>
            <MDBBtn 
              color='danger' 
              onClick={onConfirm}
              disabled={isDeleting}
              className={`btn-interactive ripple ${isDeleting ? 'pulse-animation' : ''}`}
            >
              <i className={`fas ${isDeleting ? 'fa-spinner rotate-loading' : 'fa-trash'} me-1`}></i>
              {isDeleting ? 'Deleting...' : 'Delete Forever'}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default DeleteConfirmModal;
