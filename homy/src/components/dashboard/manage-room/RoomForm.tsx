// RoomForm.tsx
import React from 'react';
import AmenitiesList from '../manage-amentity/AmentityList';

interface RoomFormProps {
  roomFormData: {
    hostelId: string;
    roomName: string;
    floor?: string;
    maxRenters: string;
    status: boolean;
    deposit: string;
    monthlyRentCost: string;
    size: string;
    roomType: string;
    amenityId: string[];
    images: File[];
  };
  handleRoomInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAmenitySelect: (selectedAmenities: string[]) => void;
  handleRoomImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  selectedAmenities: string[];
}



const RoomForm: React.FC<RoomFormProps> = ({
  roomFormData,
  handleRoomInputChange,
  handleAmenitySelect,
  handleRoomImageChange,
  handleRemoveImage,
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
        <label>Tầng</label>
        <input
          type="number"
          name="floor"
          value={roomFormData.floor}
          onChange={handleRoomInputChange}
          className="form-control"
          min="0"
        />
      </div>

      <div className="modal-form-group">
        <label>Số người thuê tối đa <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          name="maxRenters"
          value={roomFormData.maxRenters}
          onChange={handleRoomInputChange}
          required
          className="form-control"
          min="1"
        />
      </div>


      <div className="modal-form-group">
        <label>Tiền đặt cọc(VND) *</label>
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
        <label>Giá thuê hàng tháng(VND) *</label>
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
        <label>Diện tích(m2) *</label>
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

      {/* Lấy ra list dịch vụ của các phòng*/}
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

      {roomFormData.images && roomFormData.images.length > 0 && (
        <div className="selected-images">
          {roomFormData.images.map((image, index) => (
            <div key={index} className="image-preview" style={{ position: 'relative' }}>
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                style={{ maxWidth: '100px', marginRight: '10px' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)} // Sử dụng handleRemoveImage từ props
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RoomForm;
