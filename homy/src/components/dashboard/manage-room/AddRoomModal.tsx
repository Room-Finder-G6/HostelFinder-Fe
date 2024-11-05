import React from 'react';
import RoomForm from './RoomForm';

interface AddRoomModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  roomFormData: any;
  handleRoomInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAmenitySelect: (selectedAmenities: string[]) => void;
  handleRoomImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddRoomSubmit: (e: React.FormEvent) => void;
  selectedAmenities: string[];
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  toggleModal,
  roomFormData,
  handleRoomInputChange,
  handleAmenitySelect,
  handleRoomImageChange,
  handleAddRoomSubmit,
  selectedAmenities,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Thêm phòng</h3>
        <form onSubmit={handleAddRoomSubmit}>
          <RoomForm
            roomFormData={roomFormData}
            handleRoomInputChange={handleRoomInputChange}
            handleAmenitySelect={handleAmenitySelect}
            handleRoomImageChange={handleRoomImageChange}
            selectedAmenities={selectedAmenities}
          />
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Lưu</button>
            <button type="button" className="btn btn-secondary" onClick={toggleModal}>Thoát</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
