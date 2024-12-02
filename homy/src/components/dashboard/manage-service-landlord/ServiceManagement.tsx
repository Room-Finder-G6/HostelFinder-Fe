"use client";
import React, { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { toast } from "react-toastify";
import './room.css';
import apiInstance from "@/utils/apiInstance";
import HostelSelector from "./HostelSelector";
import { FaBuilding, FaMoneyBill, FaPlus } from 'react-icons/fa';
import { useSearchParams } from "next/navigation";
import './service.css'; 
interface Service {
  id: string;
  serviceName: string;
  isBillable: boolean;
}

interface Hostel {
  id: string;
  name: string;
}

const RoomManagement = () => {
  const searchParams = useSearchParams();
  const hostelId = searchParams.get('hostelId');  // ID của nhà trọ từ URL (nếu có)

  const [selectedHostel, setSelectedHostel] = useState<string>('');
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isServicePriceModalOpen, setIsServicePriceModalOpen] = useState(false);

  // Lấy danh sách nhà trọ
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await apiInstance.get('/hostels');  // API lấy danh sách nhà trọ
        if (response.data.succeeded) {
          setHostels(response.data.data);
        } else {
          toast.warning("Không tìm thấy nhà trọ nào.", { position: "top-center" });
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải danh sách nhà trọ.", { position: "top-center" });
      }
    };
    fetchHostels();
  }, []);

  // Khi chọn một nhà trọ, lấy danh sách dịch vụ của nhà trọ đó
  useEffect(() => {
    if (!selectedHostel) return;

    const fetchServices = async () => {
      try {
        const response = await apiInstance.get(`/services/hostels/${selectedHostel}`);  // API lấy dịch vụ của nhà trọ
        if (response.data.succeeded) {
          setServices(response.data.data);
        } else {
          setServices([]);  // Nếu không có dịch vụ, gán mảng trống
        }
      } catch (error) {
        toast.error("Không thể lấy danh sách dịch vụ của nhà trọ.", { position: "top-center" });
      }
    };
    fetchServices();
  }, [selectedHostel]);

  // Hàm xử lý thay đổi nhà trọ
  const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hostelId = e.target.value;
    setSelectedHostel(hostelId);
  };

  // Hàm mở/đóng modal quản lý giá dịch vụ
  const toggleServicePriceModal = () => {
    if (!selectedHostel) {
      toast.warning("Vui lòng chọn nhà trọ trước khi muốn quản lý dịch vụ", { position: "top-center" });
      return;
    }
    setIsServicePriceModalOpen(!isServicePriceModalOpen);
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
          {/* Utility Buttons */}
          <div className="d-flex align-items-center gap-4">
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
              Quản lý giá dịch vụ
            </button>
          </div>
        </div>

        {/* Hiển thị danh sách dịch vụ khi chọn nhà trọ */}
        {services.length > 0 && (
          <div className="service-list">
            <h4>Dịch vụ của nhà trọ:</h4>
            <ul>
              {services.map(service => (
                <li key={service.id}>
                  <span>{service.serviceName}</span>
                  <span>{service.isBillable ? "Có thể tính phí" : "Miễn phí"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal quản lý giá dịch vụ */}
        {isServicePriceModalOpen && (
          <div className="modal show d-block" tabIndex={1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title" style={{ color: '#007bff' }}>Quản lý giá dịch vụ</h3>
                  <button type="button" className="btn-close" onClick={toggleServicePriceModal}></button>
                </div>
                {/* Thêm các nội dung quản lý giá dịch vụ ở đây */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;
