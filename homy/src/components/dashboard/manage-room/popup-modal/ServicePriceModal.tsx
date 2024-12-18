'use client';

import React, { useState, useEffect } from 'react';
import ServiceModal from './ServiceModal';
import apiInstance from '@/utils/apiInstance';
import { toast } from 'react-toastify';
import "./css/ServicePriceModal.css";

interface Service {
    serviceId: string;
    serviceName: string;
}

interface ServicePrice {
    id: string;
    serviceId: string;
    serviceName: string;
    unitCost: number;
    unit: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

interface ServicePriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    hostelId: string;
}

const ServicePriceModal: React.FC<ServicePriceModalProps> = ({ isOpen, onClose, hostelId }) => {
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
    const [formData, setFormData] = useState({
        serviceId: '',
        unitCost: '',
        unit: '',
        effectiveFrom: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingServicePrice, setEditingServicePrice] = useState<ServicePrice | null>(null);
    const [isFree, setIsFree] = useState(false);

    // Define UnitType options
    const unitOptions = [
        { value: '0', label: 'Không có đơn vị' },
        { value: '1', label: 'kWh' },
        { value: '2', label: 'Khối' },
        { value: '3', label: 'Theo người' },
        { value: '4', label: 'Theo tháng' },
    ];

    const unitLabels: { [key: number]: string } = {
        0: 'Không có đơn vị',
        1: 'kWh',
        2: 'Khối',
        3: 'Theo người',
        4: 'Theo tháng',
    };

    const getUnitLabel = (unitValue: number) => {
        return unitLabels[unitValue] || '';
    };

    useEffect(() => {
        if (isOpen) {
            fetchAvailableServices();
            fetchServicePrices(hostelId);
        }
    }, [isOpen, hostelId]);

    const fetchAvailableServices = async () => {
        try {
            const response = await apiInstance.get(`/services/hostels/${hostelId}`);
            if (response.data.succeeded && response.status === 200) {
                setAvailableServices(response.data.data);
            }
        } catch (error: any) {
            toast.error('Lỗi khi tải danh sách dịch vụ');
        }
    };

    const fetchServicePrices = async (hostelId: string) => {
        try {
            const response = await apiInstance.get(`/ServiceCost/hostels?hostelId=${hostelId}`);
            if (response.data.succeeded) {
                setServicePrices(response.data.data);
            } else {
            }
        } catch (error) {

        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'unitCost') {
            if (value === '0') {
                setIsFree(true);
            } else {
                setIsFree(false);
            }
        }
    };

    const handleIsFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsFree(checked);
        setFormData({
            ...formData,
            unitCost: checked ? '0' : '',
            unit: checked ? '0' : formData.unit,
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                hostelId: hostelId,
                serviceId: formData.serviceId,
                unitCost: parseFloat(formData.unitCost),
                unit: parseInt(formData.unit),
                effectiveFrom: formData.effectiveFrom,
            };

            if (isEditing && editingServicePrice) {
                const response = await apiInstance.put(`/ServiceCost/${editingServicePrice.id}`, data);
                if (response.data.succeeded) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message || 'Failed to update service price');
                }
            } else {
                const response = await apiInstance.post('/ServiceCost', data);
                if (response.data.succeeded) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message || 'Failed to add service price');
                }
            }

            fetchServicePrices(hostelId);
            setFormData({
                serviceId: '',
                unitCost: '',
                unit: '',
                effectiveFrom: '',
            });
            setIsEditing(false);
            setEditingServicePrice(null);
            setIsFree(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleEditButtonClick = (servicePrice: ServicePrice) => {
        setIsEditing(true);
        setEditingServicePrice(servicePrice);
        setFormData({
            serviceId: servicePrice.serviceId,
            unitCost: servicePrice.unitCost.toString(),
            unit: servicePrice.unit.toString(),
            effectiveFrom: servicePrice.effectiveFrom.split('T')[0],
        });
        setIsFree(servicePrice.unitCost === 0);
    };

    const handleDeleteServicePrice = async (servicePriceId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa giá dịch vụ này?')) return;

        try {
            const response = await apiInstance.delete(`/ServiceCost/${servicePriceId}`);
            if (response.data.succeeded) {
                toast.success('Service price deleted successfully');
                fetchServicePrices(hostelId);
            } else {
                toast.error(response.data.message || 'Failed to delete service price');
            }
        } catch (error) {
            toast.error('An error occurred while deleting service price');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingServicePrice(null);
        setFormData({
            serviceId: '',
            unitCost: '',
            unit: '',
            effectiveFrom: '',
        });
        setIsFree(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };



    return (
        <ServiceModal isOpen={isOpen} onClose={onClose} title="Quản lý giá dịch vụ">
            <div className="container-fluid px-4 py-3">
                {/* Alert with modern styling */}
                <div className="alert alert-warning border-0 shadow-sm mb-4" role="alert">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill fs-4 me-3 text-warning"></i>
                        <div>
                            <h6 className="alert-heading mb-1">Chú ý quan trọng</h6>
                            <p className="mb-0 small">
                                Giá dịch vụ mới sẽ chỉ được áp dụng cho các hoá đơn được tạo sau khi cập nhật.
                                Các hoá đơn cũ sẽ giữ nguyên giá trị.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Service Prices Table with modern styling */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-transparent border-bottom-0 py-3">
                        <h5 className="mb-0">Danh sách giá dịch vụ</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th scope="col" className="border-0">Dịch vụ</th>
                                    <th scope="col" className="border-0 text-end">Đơn giá</th>
                                    <th scope="col" className="border-0">Đơn vị</th>
                                    <th scope="col" className="border-0">Hiệu lực từ</th>
                                    <th scope="col" className="border-0 text-center" style={{ width: '120px' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicePrices.length > 0 ? (
                                    servicePrices.map((servicePrice: ServicePrice) => {
                                        const formattedUnitCost = new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(servicePrice.unitCost);


                                        return (
                                            <tr key={servicePrice.id}>
                                                <td className="align-middle">
                                                    <span className="fw-medium">{servicePrice.serviceName}</span>
                                                </td>
                                                <td className="align-middle text-end">
                                                    <span className={`badge ${servicePrice.unitCost === 0 ? 'bg-success' : 'bg-primary'}`}>
                                                        {servicePrice.unitCost === 0 ? 'Miễn phí' : formattedUnitCost}
                                                    </span>
                                                </td>
                                                <td className="align-middle">
                                                    {servicePrice.unitCost === 0 ? '-' : getUnitLabel(servicePrice.unit)}
                                                </td>
                                                <td className="align-middle">
                                                    <i className="bi bi-calendar3 me-2 text-muted"></i>
                                                    {formatDate(servicePrice.effectiveFrom)}
                                                </td>

                                                <td className="align-middle text-center">
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-light btn-sm"
                                                            onClick={() => handleEditButtonClick(servicePrice)}
                                                            title="Chỉnh sửa"
                                                        >
                                                            <i className="bi bi-pencil text-primary"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-light btn-sm"
                                                            onClick={() => handleDeleteServicePrice(servicePrice.id)}
                                                            title="Xóa"
                                                        >
                                                            <i className="bi bi-trash text-danger"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-muted">
                                            <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                                            Không có dịch vụ nào cho nhà trọ này
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Card with modern styling */}
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-transparent py-3">
                        <h5 className="mb-0">
                            {isEditing ? 'Cập nhật giá dịch vụ' : 'Thêm giá dịch vụ mới'}
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleFormSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            name="serviceId"
                                            value={formData.serviceId}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required
                                            disabled={isEditing}
                                            id="serviceSelect"
                                        >
                                            <option value="">Chọn dịch vụ</option>
                                            {availableServices.map((service: Service) => (
                                                <option key={service.serviceId} value={service.serviceId}>
                                                    {service.serviceName}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="serviceSelect">Dịch vụ</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-check form-switch ps-0">
                                        <div className="d-flex align-items-center">
                                            <label className="form-check-label me-3">Tính phí</label>
                                            <div className="form-check form-switch mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id="isFreeSwitch"
                                                    checked={isFree}
                                                    onChange={handleIsFreeChange}
                                                />
                                                <label className="form-check-label" htmlFor="isFreeSwitch">
                                                    Miễn phí
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!isFree && (
                                    <>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    name="unitCost"
                                                    value={formData.unitCost}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                    min="0"
                                                    id="unitCost"
                                                    placeholder="Nhập đơn giá"
                                                />
                                                <label htmlFor="unitCost">Đơn giá (VND)</label>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select
                                                    name="unit"
                                                    value={formData.unit}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                    required
                                                    id="unitSelect"
                                                >
                                                    <option value="">Chọn đơn vị</option>
                                                    {unitOptions.map((unit) => (
                                                        <option key={unit.value} value={unit.value}>
                                                            {unit.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <label htmlFor="unitSelect">Đơn vị tính</label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            name="effectiveFrom"
                                            value={formData.effectiveFrom}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                            id="effectiveFrom"
                                        />
                                        <label htmlFor="effectiveFrom">Ngày hiệu lực</label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={handleCancelEdit}
                                    >
                                        <i className="bi bi-x-lg me-2"></i>Hủy
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary">
                                    <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ServiceModal>
    );
};

export default ServicePriceModal;