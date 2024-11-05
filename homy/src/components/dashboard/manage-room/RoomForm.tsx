// RoomForm.tsx
import React from 'react';
import AmenitiesList from '../manage-amentity/AmentityList';

interface RoomFormProps {
  roomFormData: {
    hostelId: string;
    roomName: string;
    status: boolean;
    deposit: string;
    monthlyRentCost: string;
    size: string;
    roomType: string;
    amenityId: string[];
  };
  handleRoomInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAmenitySelect: (selectedAmenities: string[]) => void;
  handleRoomImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedAmenities: string[];
}

const RoomForm: React.FC<RoomFormProps> = ({
  roomFormData,
  handleRoomInputChange,
  handleAmenitySelect,
  handleRoomImageChange,
  selectedAmenities,
}) => {
  return (
    <>
      <div className="modal-form-group">
        <label>Tên phòng*</label>
        <input
          type="text"
          name="roomName"
          value={roomFormData.roomName}
          onChange={handleRoomInputChange}
          required
          className="form-control"
        />
      </div>

      <div className="modal-form-group">
        <label>Tiền đặt cọc *</label>
        <input
          type="number"
          name="deposit"
          value={roomFormData.deposit}
          onChange={handleRoomInputChange}
          required
          className="form-control"
        />
      </div>

      <div className="modal-form-group">
        <label>Giá thuê hàng tháng *</label>
        <input
          type="number"
          name="monthlyRentCost"
          value={roomFormData.monthlyRentCost}
          onChange={handleRoomInputChange}
          required
          className="form-control"
        />
      </div>

      <div className="modal-form-group">
        <label>Diện tích *</label>
        <input
          type="number"
          name="size"
          value={roomFormData.size}
          onChange={handleRoomInputChange}
          required
          className="form-control"
        />
      </div>

      <div className="modal-form-group">
        <label>Loại phòng *</label>
        <select
          name="roomType"
          value={roomFormData.roomType}
          onChange={handleRoomInputChange}
          required
          className="form-select"
        >
          <option value="">Chọn loại phòng</option>
          <option value="1">Phòng trọ</option>
          <option value="2">Phòng chung cư</option>
          <option value="3">Phòng chung cư mini</option>
          {/* Thêm các loại phòng khác nếu có */}
        </select>
      </div>

      {/* Tích hợp AmenitiesList */}
      <AmenitiesList
        onAmenitySelect={handleAmenitySelect}
        selectedAmenities={selectedAmenities}
      />

      {/* Upload hình ảnh phòng */}
      <div className="modal-form-group">
        <label>Hình ảnh phòng</label>
        <input
          type="file"
          name="roomImages"
          multiple
          onChange={handleRoomImageChange}
          className="form-control"
        />
      </div>
    </>
  );
};

export default RoomForm;
