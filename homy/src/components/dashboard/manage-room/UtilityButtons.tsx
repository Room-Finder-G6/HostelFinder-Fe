import React from 'react';

interface UtilityButtonsProps {
  onAddRoomClick: () => void;
  onUpdateInfoClick: () => void;
}

const UtilityButtons: React.FC<UtilityButtonsProps> = ({ onAddRoomClick, onUpdateInfoClick }) => {
  return (
    <div className="d-flex align-items-center mb-4">
      <button className="btn btn-success me-2">Tất cả hóa đơn tiền nhà</button>
      <button className="btn btn-primary me-2">Nhập dữ liệu</button>
      <button className="btn btn-warning me-2">In tất cả hóa đơn</button>
      <button className="btn btn-info me-2">Gửi hóa đơn</button>
      <button className="btn btn-secondary me-2" onClick={onAddRoomClick}>Thêm phòng</button>
      <button className="btn btn-danger me-2">Cấu hình bảng giá</button>
      <button onClick={onUpdateInfoClick} className="btn btn-success">
        Cập nhật thông tin
      </button>
    </div>
  );
};

export default UtilityButtons;
