import React from 'react';
import PropertyTableBody from "../manage-hostel/PropertyTableBody";
import HostelSelector from "./HostelSelector";  // Import HostelSelector component

const RoomTable: React.FC = () => {
  return (
    <div className="bg-white card-box p0 border-20">
      <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
        <table className="table property-list-table">
          <thead>
            <tr>
              <th scope="col">Nhà trọ</th>
              <th scope="col">Ngày tạo</th>
              <th scope="col">Trạng thái</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <PropertyTableBody />
        </table>
      </div>
    </div>
  );
};

export default RoomTable;
