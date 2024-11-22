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
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-red-600 focus:outline-none p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-200"
      >
        &times;
      </button>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Tên phòng<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="roomName"
          value={roomFormData.roomName}
          onChange={handleRoomInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tầng
        </label>
        <input
          type="number"
          name="floor"
          value={roomFormData.floor}
          onChange={handleRoomInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Số người thuê tối đa<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="maxRenters"
          value={roomFormData.maxRenters}
          onChange={handleRoomInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tiền đặt cọc (VND)<span className="text-red-500">*</span>
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Giá thuê hàng tháng (VND)<span className="text-red-500">*</span>
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diện tích (m²)<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="size"
          value={roomFormData.size}
          onChange={handleRoomInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Loại phòng<span className="text-red-500">*</span>
        </label>
        <select
          name="roomType"
          value={roomFormData.roomType}
          onChange={handleRoomInputChange}
          required
          className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Chọn loại phòng</option>
          <option value="1">Phòng trọ</option>
          <option value="2">Phòng chung cư</option>
          <option value="3">Phòng chung cư mini</option>
          {/* Add more room types as needed */}
        </select>
      </div>

      {/* Lấy ra list dịch vụ của các phòng*/}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dịch vụ phòng
        </label>
        <AmenitiesList
          onAmenitySelect={handleAmenitySelect}
          selectedAmenities={selectedAmenities}
        />
      </div>

      {/* Room Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hình ảnh phòng
        </label>
        <input
          type="file"
          name="roomImages"
          multiple
          onChange={handleRoomImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {/* Image Previews */}
      {roomFormData.images && roomFormData.images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {roomFormData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="w-full h-30 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 focus:outline-none"
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