import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastClass = () => {
    const baseClass = 'toast-notification';
    const typeClass = {
      success: 'toast-success',
      error: 'toast-error',
      warning: 'toast-warning',
      info: 'toast-info'
    }[type];
    
    return `${baseClass} ${typeClass} ${isVisible ? 'toast-show' : 'toast-hide'}`;
  };

  const getIcon = () => {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type];
  };

  return (
    <div className={getToastClass()}>
      <div className="toast-content">
        <i className={`${getIcon()} toast-icon`}></i>
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;
