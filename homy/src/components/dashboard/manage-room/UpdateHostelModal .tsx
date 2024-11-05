import React from 'react';

interface UpdateHostelModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const UpdateHostelModal: React.FC<UpdateHostelModalProps> = ({
  isOpen,
  toggleModal,
  formData,
  handleInputChange,
  handleSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Cập nhật nhà</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label>Tên nhà *</label>
            <input
              type="text"
              name="houseName"
              value={formData.houseName}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          {/* Các trường khác */}
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Lưu</button>
            <button type="button" className="btn btn-secondary" onClick={toggleModal}>Thoát</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHostelModal;
