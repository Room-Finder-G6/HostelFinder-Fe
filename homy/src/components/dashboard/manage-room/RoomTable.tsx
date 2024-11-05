import React from 'react';
import PropertyTableBody from "../manage-hostel/PropertyTableBody";

const RoomTable: React.FC = () => {
  return (
    <div className="bg-white card-box p0 border-20">
      <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
        <table className="table property-list-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date</th>
              <th scope="col">Views</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <PropertyTableBody />
        </table>
      </div>
    </div>
  );
};

export default RoomTable;
