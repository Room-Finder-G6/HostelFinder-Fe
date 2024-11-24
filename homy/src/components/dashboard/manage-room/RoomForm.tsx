// components/RoomForm.tsx
import React from 'react';
import AmenitiesList from '../manage-amentity/AmentityList';
import "./room.css"

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
  onClose: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({
  roomFormData,
  handleRoomInputChange,
  handleAmenitySelect,
  handleRoomImageChange,
  handleRemoveImage,
  selectedAmenities,
  onClose,
}) => {
  // Formatter for VND currency
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  // Handle deposit input change with formatting
  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, '');
    handleRoomInputChange({
      ...e,
      target: {
        ...e.target,
        name: 'deposit',
        value: rawValue,
      },
    });
  };

  // Handle monthly rent cost input change with formatting
  const handleMonthlyRentCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    handleRoomInputChange({
      ...e,
      target: {
        ...e.target,
        name: 'monthlyRentCost',
        value: rawValue,
      },
    });
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          Tên phòng<span className="text-danger">*</span>
        </label>
        <input
          type="text"
          name="roomName"
          value={roomFormData.roomName}
          onChange={handleRoomInputChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Tầng
        </label>
        <input
          type="number"
          name="floor"
          value={roomFormData.floor}
          onChange={handleRoomInputChange}
          className="form-control"
          min="0"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Số người thuê tối đa<span className="text-danger">*</span>
        </label>
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

      <div className="mb-3">
        <label className="form-label">
          Tiền đặt cọc (VND)<span className="text-danger">*</span>
        </label>
        <input
          type="text"
          name="deposit"
          value={
            roomFormData.deposit
              ? formatter.format(Number(roomFormData.deposit))
              : ''
          }
          onChange={handleDepositChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Giá thuê hàng tháng (VND)<span className="text-danger">*</span>
        </label>
        <input
          type="text"
          name="monthlyRentCost"
          value={
            roomFormData.monthlyRentCost
              ? formatter.format(Number(roomFormData.monthlyRentCost))
              : ''
          }
          onChange={handleMonthlyRentCostChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Diện tích (m²)<span className="text-danger">*</span>
        </label>
        <input
          type="number"
          name="size"
          value={roomFormData.size}
          onChange={handleRoomInputChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Loại phòng<span className="text-danger">*</span>
        </label>
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
          {/* Add more room types as needed */}
        </select>
      </div>

      {/* Lấy ra list dịch vụ của các phòng*/}
      <div className="mb-3">
        <label className="form-label">
          Dịch vụ phòng
        </label>
        <AmenitiesList
          onAmenitySelect={handleAmenitySelect}
          selectedAmenities={selectedAmenities}
        />
      </div>

      {/* Room Images */}
      <div className="mb-3">
        <label className="form-label">
          Hình ảnh phòng
        </label>
        <input
          type="file"
          name="roomImages"
          multiple
          onChange={handleRoomImageChange}
          className="form-control"
        />
      </div>

      {/* Image Previews */}
      {roomFormData.images && roomFormData.images.length > 0 && (
        <div className="mt-3 row row-cols-1 row-cols-md-4 g-2">
          {roomFormData.images.map((image, index) => (
            <div key={index} className="col position-relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="img-fluid rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="btn btn-danger btn-xs position-absolute top-0 end-0 m-1"
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
