import React from 'react';
import './../serviceCost.css';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const ServiceModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{title}</h3>
                <button className="modal-close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ServiceModal;
