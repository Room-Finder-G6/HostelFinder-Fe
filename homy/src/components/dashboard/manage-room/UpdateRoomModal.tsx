// components/dashboard/UpdateRoomModal.tsx
import React from 'react';
import RoomForm from "./RoomForm";

interface UpdateRoomModalProps {
   isOpen: boolean;
   toggleModal: () => void;
   roomFormData: {
      hostelId: string;
      roomName: string;
      status: boolean;
      deposit: string;
      monthlyRentCost: string;
      size: string;
      roomType: string;
      amenityId: string[];
      roomId: string; // Thêm roomId nếu cần
   };
   handleRoomInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
   handleAmenitySelect: (selectedAmenities: string[]) => void;
   handleRoomImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   handleUpdateRoomSubmit: (e: React.FormEvent) => void;
   selectedAmenities: string[];
}

const UpdateRoomModal: React.FC<UpdateRoomModalProps> = ({
   isOpen,
   toggleModal,
   roomFormData,
   handleRoomInputChange,
   handleAmenitySelect,
   handleRoomImageChange,
   handleUpdateRoomSubmit,
   selectedAmenities,
}) => {
   if (!isOpen) return null;

   return (
      <div className="modal-overlay">
         <div className="modal-content">
            <h3 className="modal-title">Cập nhật phòng</h3>
            <form onSubmit={handleUpdateRoomSubmit}>
               {/* Sử dụng RoomForm */}
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

export default UpdateRoomModal;
