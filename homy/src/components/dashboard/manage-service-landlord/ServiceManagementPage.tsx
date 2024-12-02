import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import { FaMoneyBill, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useSearchParams } from "next/navigation";

const ServiceManagement = () => {
   const searchParams = useSearchParams();
   const hostelId = searchParams.get('hostelId');
   const [services, setServices] = useState<any[]>([]);
   const [isServicePriceModalOpen, setIsServicePriceModalOpen] = useState(false);
   const [selectedService, setSelectedService] = useState<any | null>(null);
   
   // Toggle modal
   const toggleServicePriceModal = () => {
      setIsServicePriceModalOpen(!isServicePriceModalOpen);
   }

   // Fetch services
   const fetchServices = async () => {
      if (!hostelId) return;
      try {
         const response = await apiInstance.get(`/services/hostels/${hostelId}`);
         if (response.status === 200 && response.data.succeeded) {
            setServices(response.data.data);
         } else {
            toast.warning("Không tìm thấy dịch vụ.");
         }
      } catch (error: any) {
         toast.error("Có lỗi xảy ra khi tải dịch vụ.");
      }
   }

   useEffect(() => {
      fetchServices();
   }, [hostelId]);

   const handleAddService = () => {
      setSelectedService(null);
      toggleServicePriceModal();
   }

   const handleEditService = (service: any) => {
      setSelectedService(service);
      toggleServicePriceModal();
   }

   const handleDeleteService = async (serviceId: string) => {
      try {
         const response = await apiInstance.delete(`/services/${serviceId}`);
         if (response.status === 200 && response.data.succeeded) {
            toast.success("Xóa dịch vụ thành công!");
            fetchServices();
         } else {
            toast.error("Không thể xóa dịch vụ.");
         }
      } catch (error: any) {
         toast.error("Có lỗi xảy ra khi xóa dịch vụ.");
      }
   }
   return (
      <div className="dashboard-body">
         <div className="d-flex align-items-center gap-4 mb-4">
            <h3>Quản lý dịch vụ</h3>
            {/* Thêm dịch vụ */}
            <button className="btn btn-success" onClick={handleAddService}>
               <FaPlus size={16} /> Thêm dịch vụ
            </button>
         </div>

         {/* Danh sách dịch vụ */}
         <div className="table-responsive">
            <table className="table property-list-table">
               <thead>
                  <tr>
                     <th>Tên dịch vụ</th>
                     <th>Giá dịch vụ</th>
                     <th>Hành động</th>
                  </tr>
               </thead>
               <tbody>
                  {services.map((service: any) => (
                     <tr key={service.id}>
                        <td>{service.name}</td>
                        <td>{service.price} VND</td>
                        <td>
                           <button className="btn btn-warning" onClick={() => handleEditService(service)}>
                              <FaEdit size={14} />
                           </button>
                           <button className="btn btn-danger" onClick={() => handleDeleteService(service.id)}>
                              <FaTrash size={14} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

      </div>
   );
}

export default ServiceManagement;
