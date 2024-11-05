"use client";
import React, { useState, useEffect, useCallback } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBody from "../manage-hostel/PropertyTableBody";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import './room.css';
import apiInstance from "@/utils/apiInstance";
import AmenitiesList from "../manage-amentity/AmentityList";
import HostelSelector from "./HostelSelector";
import { jwtDecode } from "jwt-decode";
import RoomForm from "./RoomForm";
import RoomTableBody from "./RoomTableBody";
interface JwtPayload {
   UserId: string;
}
const RoomManagement = () => {
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
   const [selectedHostel, setSelectedHostel] = useState("");
   const [hostels, setHostels] = useState([]);
   const [roomFormData, setRoomFormData] = useState({
      hostelId: "",
      roomName: "",
      floor: "",
      maxRenters: "",
      status: true,
      deposit: "",
      monthlyRentCost: "",
      size: "",
      roomType: "",
      amenityId: [],
      images: [] as File[],
   });
   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
   const [error, setError] = useState<string | null>(null);

   const toggleUpdateModal = () => {
      setIsUpdateModalOpen(!isUpdateModalOpen);
   };

   const toggleAddRoomModal = () => {
      setIsAddRoomModalOpen(!isAddRoomModalOpen);
   };

   const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setRoomFormData({ ...roomFormData, [name]: value });
   };

   const handleAmenitySelect = (selectedAmenities: string[]) => {
      setSelectedAmenities(selectedAmenities);
   };

   const handleRoomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const files = Array.from(e.target.files);
         setRoomFormData({
            ...roomFormData,
            images: [...roomFormData.images, ...files],
         });
      }
   };

   const handleRemoveImage = (index: number) => {
      const newImages = [...roomFormData.images];
      newImages.splice(index, 1);
      setRoomFormData({ ...roomFormData, images: newImages });
   };


   const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const hostelId = e.target.value;
      setSelectedHostel(hostelId);
      setRoomFormData({ ...roomFormData, hostelId });
   };
   // Hàm lấy landlordId từ token
   const getUserIdFromToken = useCallback(() => {
      const token = window.localStorage.getItem("token");
      if (token) {
         try {
            const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
            return decodedToken.UserId;
         } catch (error) {
            console.error("Error decoding token:", error);
            setError("Error decoding user token");
            return null;
         }
      }
      setError("No token found");
      return null;
   }, []);




   const handleAddRoomSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!roomFormData.hostelId) {
         toast.error("Vui lòng chọn nhà trọ", { position: "top-center" });
         return;
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const validateFileSize = (file: File): boolean => {
         if (file.size > MAX_FILE_SIZE) {
            toast.error(`File ${file.name} vượt quá kích thước cho phép (5MB)`, { position: "top-center" });
            return false;
         }
         return true;
      };

      for (const image of roomFormData.images) {
         if (!validateFileSize(image)) {
            return;
         }
      }

      if (!roomFormData.maxRenters) {
         toast.error("Vui lòng nhập số người tối đa thuê", { position: "top-center" })
         return;
      }

      const floor = roomFormData.floor ? parseInt(roomFormData.floor) : null;
      const maxRenters = parseInt(roomFormData.maxRenters);

      const formData = new FormData();
      formData.append("HostelId", roomFormData.hostelId);
      formData.append("RoomName", roomFormData.roomName);
      formData.append("Status", String(roomFormData.status));
      formData.append("Deposit", roomFormData.deposit);
      formData.append("MonthlyRentCost", roomFormData.monthlyRentCost);
      formData.append("Size", roomFormData.size);
      formData.append("RoomType", roomFormData.roomType);
      if (floor !== null) {
         formData.append("Floor", floor.toString());
      }
      formData.append("MaxRenters", maxRenters.toString());

      // Thêm danh sách AmenityId
      selectedAmenities.forEach((amenityId) => {
         formData.append("AmenityId", amenityId);
      });

      // Thêm các hình ảnh phòng
      roomFormData.images.forEach((image) => {
         formData.append("roomImages", image);
      });

      try {
         const response = await apiInstance.post("/rooms", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         if (response.status === 200 || response.data.succeeded) {
            toast.success("Thêm phòng thành công", { position: "top-center" });
            setIsAddRoomModalOpen(false);
            // Reset form nếu cần
         } else {
            toast.error("Có lỗi xảy ra khi thêm phòng", { position: "top-center" });
         }
      } catch (error: any) {
         console.error("Error adding room:", error);
         toast.error("Có lỗi xảy ra khi thêm phòng", { position: "top-center" });
      }
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Manage Room" />
            <h2 className="main-title d-block d-lg-none">Manage Room</h2>

            {/* Hostel Selector */}
            <HostelSelector
               selectedHostel={selectedHostel}
               onHostelChange={handleHostelChange}

            />

            {/* Utility Buttons */}
            <div className="d-flex align-items-center mb-4">
               <button className="btn btn-success me-2">Tất cả hóa đơn tiền nhà</button>
               <button className="btn btn-primary me-2">Nhập dữ liệu</button>
               <button className="btn btn-warning me-2">In tất cả hóa đơn</button>
               <button className="btn btn-info me-2">Gửi hóa đơn</button>
               <button className="btn btn-secondary me-2" onClick={toggleAddRoomModal}>Thêm phòng</button>
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
                           <th scope="col">Phòng</th>
                           <th scope="col">Ngày tạo</th>
                           <th scope="col">Giá phòng</th>
                           <th scope="col">Trạng thái</th>
                           <th scope="col"></th>
                        </tr>
                     </thead>
                     <RoomTableBody selectedHostel={selectedHostel} />
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
            {/* {isUpdateModalOpen && (
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
            )} */}

            {/* Modal thêm phòng */}
            {isAddRoomModalOpen && (
               <div className="modal-overlay">
                  <div className="modal-content">
                     <h3 className="modal-title">Thêm phòng</h3>
                     <form onSubmit={handleAddRoomSubmit}>
                        {/* Sử dụng RoomForm */}
                        <RoomForm
                           roomFormData={roomFormData}
                           handleRoomInputChange={handleRoomInputChange}
                           handleAmenitySelect={handleAmenitySelect}
                           handleRoomImageChange={handleRoomImageChange}
                           handleRemoveImage={handleRemoveImage}
                           selectedAmenities={selectedAmenities}
                        />

                        <div className="modal-footer">
                           <button type="submit" className="btn btn-primary">Lưu</button>
                           <button type="button" className="btn btn-secondary" onClick={toggleAddRoomModal}>Thoát</button>
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
