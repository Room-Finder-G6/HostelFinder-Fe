"use client";
import React, { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import { FaMoneyBill, FaPlus, FaTrash } from 'react-icons/fa';
import { useSearchParams } from "next/navigation";
import './service.css';
import HostelSelector from "./HostelSelector";
interface ServiceCost {
   id: string;
   serviceId: string;
   serviceName: string;
   unitCost: number;
   unit: number;
   effectiveFrom: string;
   effectiveTo: string | null;
}

interface Service {
   id: string;
   serviceId: string;
   hostelId: string;
   serviceName: string;
   hostelName: string;
   chargingMethod: number;
   serviceCost: ServiceCost[];
}

interface Hostel {
   id: string;
   name: string;
}

const ServiceManagement = () => {
   const searchParams = useSearchParams();
   const hostelId = searchParams.get('hostelId');  // ID của nhà trọ từ URL (nếu có)

   const [selectedHostel, setSelectedHostel] = useState<string>('');
   const [hostels, setHostels] = useState<Hostel[]>([]);
   const [services, setServices] = useState<Service[]>([]);
   const [isServicePriceModalOpen, setIsServicePriceModalOpen] = useState(false);
   const [selectedService, setSelectedService] = useState<Service | null>(null);
   const [newPrice, setNewPrice] = useState<number>(0);
   const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);  // Modal trạng thái
   const [newService, setNewService] = useState({
      serviceName: '',
      chargingMethod: 0,
   });

   const unitOptions = [
      { value: 0, label: 'Không có đơn vị' },
      { value: 1, label: 'kWh' },
      { value: 2, label: 'Khối' },
      { value: 3, label: 'Theo người' },
      { value: 4, label: 'Theo tháng' },
   ];

   const chargingMethodLabels: { [key: number]: string } = {
      0: 'Không tính phí',
      1: 'Phí theo kWh',
      2: 'Phí theo Khối',
      3: 'Phí theo người',
      4: 'Phí theo tháng',
   };

   useEffect(() => {
      if (!selectedHostel) return;

      const fetchServices = async () => {
         try {
            const response = await apiInstance.get(`/services/hostels/${selectedHostel}`);
            if (response.data.succeeded) {
               setServices(response.data.data);
            } else {
               setServices([]);
            }
         } catch (error) {
            toast.error("Không thể lấy danh sách dịch vụ của nhà trọ.", { position: "top-center" });
         }
      };
      fetchServices();
   }, [selectedHostel]);

   const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const hostelId = e.target.value;
      setSelectedHostel(hostelId);
   };

   const toggleAddServiceModal = () => {
      setIsAddServiceModalOpen(!isAddServiceModalOpen);
   };

   const handleAddServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name === "chargingMethod") {
         setNewService({
            ...newService,
            [name]: Number(value),
         });
      } else {
         setNewService({
            ...newService,
            [name]: value,
         });
      }
   };
   const handleDeleteService = async (id: string) => {
      try {
         const response = await apiInstance.delete(`/services/DeleteService/${id}`);
         if (response.data.succeeded) {
            toast.success("Xóa dịch vụ thành công.", { position: "top-center" });
            // Cập nhật lại danh sách dịch vụ sau khi xóa
            setServices(services.filter(service => service.id !== id));  // Dùng đúng 'id'
         } else {
            toast.error("Xóa dịch vụ thất bại.", { position: "top-center" });
         }
      } catch (error) {
         toast.error("Có lỗi xảy ra khi xóa dịch vụ.", { position: "top-center" });
      }
   };


   const handleAddServiceSubmit = async () => {
      if (!newService.serviceName || newService.serviceName.trim() === "") {
         toast.warning("Vui lòng nhập tên dịch vụ.", { position: "top-center" });
         return;
      }

      const payload = {
         serviceName: newService.serviceName,
         hostelId: selectedHostel,
         chargingMethod: parseInt(newService.chargingMethod.toString(), 10),
      };

      try {
         const response = await apiInstance.post('/services/AddService', payload);
         if (response.data.succeeded) {
            toast.success("Thêm dịch vụ thành công.", { position: "top-center" });
            setIsAddServiceModalOpen(false);
            setServices([...services, response.data.data]);
         } else {
            toast.error("Thêm dịch vụ thất bại.", { position: "top-center" });
         }
      } catch (error) {
         toast.error("Dịch vụ đã tồn tại. Hãy truy cập quản lý nhà trọ để thêm", { position: "top-center" });
      }
   };
   const handleDeleteButtonClick = (id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
         handleDeleteService(id);  // Truyền id thay vì serviceId
      }
   };
   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Quản lí nhà trọ và dịch vụ" />   
            <h2 className="main-title d-block d-lg-none">Quản lí nhà trọ và dịch vụ</h2>
            {/* Chọn nhà trọ */}
            <div className="d-flex align-items-center gap-4 mb-4">
               <HostelSelector
                  selectedHostel={selectedHostel}
                  onHostelChange={handleHostelChange}
               />
               <div className="d-flex align-items-center gap-4">
                  <button className="btn btn-success btn-sm" onClick={toggleAddServiceModal}>
                     <FaPlus size={14} /> Thêm dịch vụ
                  </button>
               </div>
            </div>
            {services.length > 0 && (
               <div className="service-list">
                  <h4>Dịch vụ của nhà trọ:</h4>
                  <div className="bg-white card-box p-4 border-20">
                     <div className="table-responsive">
                        <table className="table property-list-table"></table>
                        <ul>
                           {services.map(service => (
                              <li key={service.id} className="d-flex justify-content-between align-items-center">
                                 <span>{service.serviceName}</span>

                                 <span>
                                    {chargingMethodLabels[service.chargingMethod]}
                                 </span>
                                 <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteButtonClick(service.id)}
                                 >
                                    <FaTrash size={14} />
                                 </button>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
            )}
            {/* Modal Add Service */}
            {isAddServiceModalOpen && (
               <div className="modal-service">
                  <div className="modal-service1">
                     <div className="modal-service2">
                        <h5 className="modal-title">Thêm dịch vụ</h5>
                        <button onClick={toggleAddServiceModal}>&times;</button>
                     </div>

                     <div className="modal-body">
                        <form onSubmit={(e) => e.preventDefault()}>
                           <div className="form-group">
                              <label htmlFor="serviceName">Tên dịch vụ</label>
                              <input
                                 type="text"
                                 id="serviceName"
                                 name="serviceName"
                                 value={newService.serviceName}
                                 onChange={handleAddServiceChange}
                                 className="form-control"
                              />
                           </div>

                           <div className="form-group">
                              <label htmlFor="chargingMethod">Cách tính phí</label>
                              <select
                                 name="chargingMethod"
                                 id="chargingMethod"
                                 value={newService.chargingMethod}
                                 onChange={handleAddServiceChange}
                                 className="form-control"
                              >
                                 {unitOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                       {option.label}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <button
                              type="submit"
                              className="btn btn-success mt-3"
                              onClick={handleAddServiceSubmit}
                           >
                              Thêm dịch vụ
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>

   );
};

export default ServiceManagement;
