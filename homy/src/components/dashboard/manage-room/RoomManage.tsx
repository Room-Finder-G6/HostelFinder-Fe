"use client";
import React, { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBody from "../manage-hostel/PropertyTableBody";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import './room.css';

const RoomManagement = () => {
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isAddModalOpen, setIsAddModalOpen] = useState(false); // New state for Add Hostel modal
   const [selectedHostel, setSelectedHostel] = useState("");
   const [hostels, setHostels] = useState([]);
   const [formData, setFormData] = useState({
      houseName: "",
      address: "",
      houseType: "",
      rentalType: "",
      province: "",
      district: "",
      commune: "",
      electricityBillingDate: "",
      billingEndDate: "",
      amenities: {
         balcony: false,
         security: false,
         camera: false,
         airConditioner: false,
         mezzanine: false,
         bed: false,
         kitchen: false,
         parking: false,
         elevator: false,
         tv: false,
         fridge: false,
         internet: false,
         heater: false,
         wifi: false,
         washingMachine: false,
         wc: false,
         wardrobe: false,
      },
   });

   const toggleUpdateModal = () => {
      setIsUpdateModalOpen(!isUpdateModalOpen);
   };

   const toggleAddModal = () => {
      setIsAddModalOpen(!isAddModalOpen);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleAmenityChange = (e) => {
      const { name, checked } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         amenities: { ...prevData.amenities, [name]: checked }
      }));
   };

   useEffect(() => {
      // Fetch hostels from API or predefined data
      const fetchHostels = async () => {
         try {
            const response = await fetch("/api/hostels"); // Adjust the API endpoint as needed
            const data = await response.json();
            setHostels(data);
         } catch (error) {
            console.error("Error fetching hostels:", error);
         }
      };
      fetchHostels();
   }, []);

   const handleHostelChange = (e) => {
      setSelectedHostel(e.target.value);
      // Optionally, fetch rooms based on the selected hostel
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      toast.success("Information updated successfully", { position: "top-center" });
      setIsUpdateModalOpen(false);
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Manage Room" />
            <h2 className="main-title d-block d-lg-none">Manage Room</h2>

            {/* Hostel Selector */}
            <div className="d-flex align-items-center mb-4">
               <label htmlFor="hostelSelect" className="me-2">Nhà:</label>
               <select
                  id="hostelSelect"
                  className="form-select"
                  value={selectedHostel}
                  onChange={handleHostelChange}
               >
                  <option value="">Chọn nhà trọ</option>
                  {hostels.map((hostel) => (
                     <option key={hostel.id} value={hostel.id}>
                        {hostel.name}
                     </option>
                  ))}
               </select>
            </div>

            {/* Utility Buttons */}
            <div className="d-flex align-items-center mb-4">
               <button className="btn btn-success me-2">Tất cả hóa đơn tiền nhà</button>
               <button className="btn btn-primary me-2">Nhập dữ liệu</button>
               <button className="btn btn-warning me-2">In tất cả hóa đơn</button>
               <button className="btn btn-info me-2">Gửi hóa đơn</button>
               {/* Updated to open Add Hostel modal */}
               <Link href="/dashboard/add-hostel" passHref>
                  <button className="btn btn-secondary me-2">Thêm phòng</button>
               </Link>
               <button className="btn btn-danger me-2">Cấu hình bảng giá</button>
               <button onClick={toggleUpdateModal} className="btn btn-success">
                  Cập nhật thông tin
               </button>
            </div>

            {/* Table Section */}
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

            {/* Pagination */}
            <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
               <li className="me-3"><a href="#">1</a></li>
               <li className="selected"><a href="#">2</a></li>
               <li><a href="#">3</a></li>
               <li><a href="#">4</a></li>
               <li>....</li>
               <li className="ms-2"><a href="#" className="d-flex align-items-center">
                  Last &gt;</a></li>
            </ul>

            {/* Update Information Modal */}
            {isUpdateModalOpen && (
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
                        <div className="modal-form-group">
                           <label>Địa chỉ *</label>
                           <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              className="form-control"
                           />
                        </div>
                        <div className="modal-form-group">
                           <label>Loại nhà *</label>
                           <select name="houseType" value={formData.houseType} onChange={handleInputChange} required className="form-select">
                              <option value="">Chọn loại nhà</option>
                              <option value="nhatro">Nhà trọ</option>
                              <option value="canho">Căn hộ</option>
                           </select>
                        </div>
                        <div className="modal-form-group">
                           <label>Hình thức cho thuê *</label>
                           <select name="rentalType" value={formData.rentalType} onChange={handleInputChange} required className="form-select">
                              <option value="">Chọn hình thức cho thuê</option>
                              <option value="baoPhong">Bao phòng</option>
                              <option value="tungPhong">Từng phòng</option>
                           </select>
                        </div>
                        <div className="modal-footer">
                           <button type="submit" className="btn btn-primary">Lưu</button>
                           <button type="button" className="btn btn-secondary" onClick={toggleUpdateModal}>Thoát</button>
                        </div>
                     </form>
                  </div>
               </div>
            )}

            {/* Add Hostel Modal */}
            {isAddModalOpen && (
               <div className="modal-overlay">
                  <div className="modal-content">
                     <h3 className="modal-title">Thêm phòng</h3>
                     <form onSubmit={handleSubmit}>
                        <div className="modal-form-group">
                           <label>Tên phòng *</label>
                           <input
                              type="text"
                              name="houseName"
                              value={formData.houseName}
                              onChange={handleInputChange}
                              required
                              className="form-control"
                           />
                        </div>
                        {/* Các trường thông tin khác của "Thêm phòng" */}
                        <div className="modal-footer">
                           <button type="submit" className="btn btn-primary">Lưu</button>
                           <button type="button" className="btn btn-secondary" onClick={toggleAddModal}>Thoát</button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default RoomManagement;
