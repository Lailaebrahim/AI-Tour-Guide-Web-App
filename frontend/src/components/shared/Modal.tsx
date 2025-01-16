import React from "react";
import { FiX } from "react-icons/fi";
import { CSSProperties } from 'react';

const modalStyles: { [key: string]: CSSProperties } = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    width: '90%',
    maxWidth: '500px',
    position: 'relative'
  },
  header: {
    padding: '16px 24px',
    borderBottom: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#fff'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: '20px 24px'
  }
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children } : ModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={modalStyles.backdrop} onClick={handleBackdropClick}>
      <div style={modalStyles.modal as React.CSSProperties}>
        <div style={modalStyles.header}>
          <div style={modalStyles.title}>{title}</div>
          <button style={modalStyles.closeButton} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
        <div style={modalStyles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;