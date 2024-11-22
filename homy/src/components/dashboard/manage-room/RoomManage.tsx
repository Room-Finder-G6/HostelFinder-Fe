"use client";
import React, { useState, useEffect, useCallback } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { toast } from "react-toastify";
import './room.css';
import apiInstance from "@/utils/apiInstance";
import HostelSelector from "./HostelSelector";
import { jwtDecode } from "jwt-decode";
import RoomForm from "./RoomForm";
import RoomTableBody from "./RoomTableBody";
import ServicePriceModal from "./ServicePriceModal";
import { useSearchParams } from "next/navigation";

import {
   FaBuilding,
   FaFileInvoiceDollar,
   FaUpload,
   FaPrint,
   FaPaperPlane,
   FaPlusCircle,
   FaTags,
   FaEdit,
   FaPlus,
   FaMoneyBill,
} from 'react-icons/fa';
import { RxUpdate } from "react-icons/rx";
interface JwtPayload {
   UserId: string;
}
interface Room {
   id: string;
   hostelName: string;
   roomName: string;
   floor: number | null;
   maxRenters: number;
   size: number;
   status: boolean;
   monthlyRentCost: number;
   roomType: number;
   createdOn: string;
   imageRoom: string;
}
const RoomManagement = () => {
   const searchParams = useSearchParams();
   const hostelId = searchParams.get('hostelId');

   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
   const [isServicePriceModalOpen, setIsServicePriceModalOpen] = useState(false);
   const [selectedHostel, setSelectedHostel] = useState("");
   const [hostels, setHostels] = useState([]);
   const [floors, setFloors] = useState<number[]>([]);
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
   const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
   const [roomsUpdate, setRoomsUpdate] = useState<number>(0);
   const [refreshRooms, setRefreshRooms] = useState<number>(0);
   const toggleUpdateModal = () => {
      setIsUpdateModalOpen(!isUpdateModalOpen);
   };

   const toggleAddRoomModal = () => {
      if (!roomFormData.hostelId) {
         toast.error("Vui lòng chọn nhà trọ trước khi thêm phòng trọ", { position: "top-center" });
         return;
      }
      setIsAddRoomModalOpen(!isAddRoomModalOpen);
   };

   const toggleServicePriceModal = () => {
      if (!selectedHostel) {
         toast.error("Vui lòng chọn nhà trọ trước khi muốn quản lí dịch vụ", { position: "top-center" });
         return;
      }
      setIsServicePriceModalOpen(!isServicePriceModalOpen);
   }

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
      setSelectedFloor(null);
   };
   useEffect(() => {
      if (hostelId) {
         setSelectedHostel(hostelId as string);
         setRoomFormData((prevData) => ({
            ...prevData,
            hostelId: hostelId as string,
         }));
      }
   }, [hostelId])


   useEffect(() => {
      if (!selectedHostel) {
         setFloors([]);
         return;
      }

      const fetchFloors = async () => {
         try {
            const response = await apiInstance.get(`/rooms/hostels/${selectedHostel}`);
            console.log(response.data);
            if (response.data.succeeded && response.status === 200) {
               const rooms = response.data.data as Room[];
               const uniqueFloors = Array.from(new Set(rooms.map((room) => room.floor).filter((floor) => floor !== null))) as number[];
               setFloors(uniqueFloors.sort((a, b) => a - b));
            }
         }
         catch (error: any) {
            if (error.response && error.response.status === 400) {
               toast.error(error.response.data.message, { position: "top-center" });
               setFloors([]);
            } else {
               toast.error("Something went wrong!", { position: "top-center" })
            }

         }
      };

      fetchFloors();
   }, [selectedHostel])

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

            setRefreshRooms(prev => prev + 1);
            // Reset form 
            setRoomFormData({
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
               images: [],
            });
            setSelectedAmenities([]);
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
            <DashboardHeaderTwo title="Quản lí phòng trọ" />
            <h2 className="main-title d-block d-lg-none">Quản lí phòng trọ </h2>

            {/* Hostel Selector */}
            <div className="flex items-center gap-4 mb-4">
               <HostelSelector
                  selectedHostel={selectedHostel}
                  onHostelChange={handleHostelChange}
               />
               {/* Utility Buttons */}
               <div className="flex items-center gap-4">
                  {/* Nút Thêm phòng */}
                  <button
                     className="flex items-center px-2 py-2 text-sm rounded bg-green-400 hover:bg-green-700 text-white transition-colors duration-200"
                     onClick={toggleAddRoomModal}
                  >
                     {/* Khu vực chứa Icon */}
                     <div className="flex items-center justify-center w-6 h-6 mr-2 bg-white-300 rounded">
                        <FaPlus size={14} />
                     </div>
                     Thêm phòng
                  </button>
                  <button
                     className="flex items-center px-2 py-2 text-sm rounded bg-green-400 hover:bg-green-700 text-white transition-colors duration-200"
                     onClick={toggleServicePriceModal}
                  >
                     <div className="flex items-center justify-center w-6 h-6 mr-2 bg-white-700 rounded">
                        <FaMoneyBill size={14} />
                     </div>
                     Bảng giá dịch vụ
                  </button>
                  <button
                     className="flex items-center px-2 py-2 text-sm rounded bg-green-400 hover:bg-green-700 text-white transition-colors duration-200"
                     onClick={toggleUpdateModal}
                  >
                     <div className="flex items-center justify-center w-6 h-6 mr-2 bg-white-700 rounded">
                        <RxUpdate size={14} />
                     </div>
                     Cập nhật thông tin
                  </button>
               </div>
            </div>


            {/* Floor Buttons */}
            {floors.length > 0 && (
               <div className="flex flex-wrap items-center gap-2 mb-4">
                  <button
                     className={`px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white ${selectedFloor === null ? "font-semibold" : "bg-gray-400 hover:bg-gray-500"
                        }`}
                     onClick={() => setSelectedFloor(null)}
                  >
                     <FaBuilding className="inline-block mr-1" />
                     Tất cả tầng
                  </button>
                  {floors.map((floor) => (
                     <button
                        key={floor}
                        className={`px-3 py-1 text-sm rounded ${selectedFloor === floor.toString()
                           ? "bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                           : "bg-gray-400 hover:bg-gray-500 text-white"
                           }`}
                        onClick={() => setSelectedFloor(floor.toString())}
                     >
                        <FaBuilding className="inline-block mr-1" />
                        {floor}
                     </button>
                  ))}
               </div>
            )}


            {/* Table Section */}
            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4" style={{ minHeight: '400px' }}>
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
                     <RoomTableBody selectedHostel={selectedHostel} selectedFloor={selectedFloor} refresh={refreshRooms} />
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
                     <h3 className="modal-title" style={{ color: "black" }}>Thêm phòng</h3>
                     <form onSubmit={handleAddRoomSubmit}>
                        {/* Nội dung RoomForm */}
                        <RoomForm
                           roomFormData={roomFormData}
                           handleRoomInputChange={handleRoomInputChange}
                           handleAmenitySelect={handleAmenitySelect}
                           handleRoomImageChange={handleRoomImageChange}
                           handleRemoveImage={handleRemoveImage}
                           selectedAmenities={selectedAmenities}
                           onClose={toggleAddRoomModal}
                        />
                        {/* Footer */}
                        <div className="modal-footer flex justify-end gap-2">
                           <button
                              type="submit"
                              className="bg-indigo-600 text-white py-2 px-4 text-sm rounded-md hover:bg-indigo-700 focus:outline-none"
                           >
                              Lưu
                           </button>
                           <button
                              type="button"
                              className="btn btn-secondary py-2 px-4 text-sm rounded-md"
                              onClick={toggleAddRoomModal}
                           >
                              Thoát
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
            {/* Modal quản lý giá dịch vụ */}
            {isServicePriceModalOpen && (
               <ServicePriceModal
                  isOpen={isServicePriceModalOpen}
                  onClose={toggleServicePriceModal}
                  hostelId={selectedHostel}
               />
            )}

         </div>
      </div>
   );
};

export default RoomManagement;
