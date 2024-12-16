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
import ServicePriceModal from "./popup-modal/ServicePriceModal";
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
      console.log(selectedHostel)
      if (!selectedHostel) {
         toast.warning("Vui lòng chọn nhà trọ trước khi thêm phòng trọ", { position: "top-center" });
         return;
      }
      setIsAddRoomModalOpen(!isAddRoomModalOpen);
   };

   const toggleServicePriceModal = () => {
      if (!selectedHostel) {
         toast.warning("Vui lòng chọn nhà trọ trước khi muốn quản lí dịch vụ", { position: "top-center" });
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
            } else {
               setFloors([]);
            }
         }
         catch (error: any) {
            if (error.response && error.response.status === 400) {
               // toast.error(error.response.data.message, { position: "top-center" });
               setFloors([]);
               toast.warning("Vui lòng chọn nhà trọ để quản lý.")
            } else {
               // toast.error("Something went wrong!", { position: "top-center" })
               setFloors([]);
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
         toast.warning("Vui lòng chọn nhà trọ", { position: "top-center" });
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
               hostelId: selectedHostel,
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
            const fetchRooms = async () => {
               try {
                  let url = `/rooms/hostels/${selectedHostel}`;
                  console.log(selectedHostel)
                  if (selectedFloor) {
                     url += `?floor=${selectedFloor}`;
                  }
                  const response = await apiInstance.get(url);
                  if (response.data.succeeded) {
                     const rooms = response.data.data as Room[];
                     const uniqueFloors = Array.from(new Set(rooms.map((room) => room.floor).filter((floor) => floor !== null))) as number[];
                     setFloors(uniqueFloors.sort((a, b) => a - b));
                  } else {
                     setFloors([]);
                  }
               } catch (err: any) {
                  setError(err.message || 'Có lỗi xảy ra khi tải danh sách phòng');
               }
            };

            fetchRooms();

         }
         if (response.status === 400 || response.data.succeeded == false) {
            toast.error(response.data.data.mesasge);
            console.log(response);
         }
      } catch (error: any) {
         toast.error(error.response.data.message);
      }
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Quản lí phòng trọ" />
            <h2 className="main-title d-block d-lg-none">Quản lí phòng trọ</h2>
            {/* Hostel Selector */}
            <div className="d-flex align-items-center gap-4 mb-4">
               <HostelSelector
                  selectedHostel={selectedHostel}
                  onHostelChange={handleHostelChange}
               />
               {/* Utility Buttons */}
               <div className="d-flex align-items-center gap-4">
                  {/* Nút Thêm phòng */}
                  <button
                     className="btn btn-success btn-sm d-flex align-items-center"
                     onClick={toggleAddRoomModal}
                  >
                     {/* Khu vực chứa Icon */}
                     <div
                        className="d-flex align-items-center justify-content-center me-2 bg-light rounded"
                        style={{ width: '24px', height: '24px', color: 'green' }}
                     >
                        <FaPlus size={14} />
                     </div>
                     Thêm phòng
                  </button>
                  <button
                     className="btn btn-success btn-sm d-flex align-items-center"
                     onClick={toggleServicePriceModal}
                  >
                     <div
                        className="d-flex align-items-center justify-content-center me-2 bg-light rounded"
                        style={{ width: '24px', height: '24px', color: 'green' }}
                     >
                        <FaMoneyBill size={14} />
                     </div>
                     Bảng giá dịch vụ
                  </button>
                  {/* <button
                     className="btn btn-success btn-sm d-flex align-items-center"
                     onClick={toggleUpdateModal}
                  >
                     <div
                        className="d-flex align-items-center justify-content-center me-2 bg-light rounded"
                        style={{ width: '24px', height: '24px', color: 'green' }}
                     >
                        <RxUpdate size={14} />
                     </div>
                     Cập nhật thông tin
                  </button> */}
               </div>
            </div>

            {/* Floor Buttons */}
            {Array.isArray(floors) && floors.length > 0 && (
               <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                  <button
                     className={`btn btn-sm ${selectedFloor === null ? 'btn-primary fw-bold' : 'btn-secondary'} d-flex align-items-center`}
                     onClick={() => setSelectedFloor(null)}
                  >
                     <FaBuilding className="me-1" />
                     Tất cả tầng
                  </button>
                  {floors.map((floor) => (
                     <button
                        key={floor}
                        className={`btn btn-sm ${selectedFloor === floor.toString() ? 'btn-primary fw-bold' : 'btn-secondary'} d-flex align-items-center`}
                        onClick={() => setSelectedFloor(floor.toString())}
                     >
                        <FaBuilding className="me-1" />
                        {floor}
                     </button>
                  ))}
               </div>
            )}

            {/* Table Section */}
            <div className="bg-white p-0" style={{ borderRadius: '20px' }}>
               <div className="table-responsive pe-4 ps-4" style={{ minHeight: '400px', paddingTop: '25px', paddingBottom: '25px' }}>
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
                     <RoomTableBody selectedHostel={selectedHostel} selectedFloor={selectedFloor} refresh={refreshRooms} setRefreshRooms={setRefreshRooms} />
                  </table>
               </div>
            </div>

            {/* Modal thêm phòng */}
            {isAddRoomModalOpen && (
               <div className="modal show d-block" tabIndex={1}>
                  <div className="modal-dialog modal-lg">
                     <div className="modal-content">
                        <div className="modal-header">
                           <h3 className="modal-title" style={{ color: '#007bff' }}>Thêm phòng</h3>
                           <button type="button" className="btn-close" onClick={toggleAddRoomModal}></button>
                        </div>
                        <form onSubmit={handleAddRoomSubmit}>
                           <div className="modal-body">
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
                           </div>
                           <div className="modal-footer">
                              <button type="submit" className="btn btn-primary">
                                 Lưu
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={toggleAddRoomModal}>
                                 Thoát
                              </button>
                           </div>
                        </form>
                     </div>
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
