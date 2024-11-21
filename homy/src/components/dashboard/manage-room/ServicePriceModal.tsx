'use client';

import React, { useState, useEffect } from 'react';
import ServiceModal from './ServiceModal';
import apiInstance from '@/utils/apiInstance';
import { toast } from 'react-toastify';

interface Service {
    serviceId: string;
    serviceName: string;
}

interface ServicePrice {
    id: string;
    serviceId: string;
    serviceName: string;
    unitCost: number;
    unit: string;
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
                console.log(response.data.data);
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                // toast.error(error.response.data.message);
            } else {
                // toast.error('An error occurred while fetching available services');
            }
        }
    };

    const fetchServicePrices = async (hostelId: string) => {
        try {
            const response = await apiInstance.get(`/ServiceCost/hostels?hostelId=${hostelId}`);
            if (response.data.succeeded) {
                setServicePrices(response.data.data);
            } else {
                toast.error('Failed to fetch service prices');
            }
        } catch (error) {
            toast.error('An error occurred while fetching service prices');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                hostelId: hostelId,
                serviceId: formData.serviceId,
                unitCost: parseFloat(formData.unitCost),
                unit: formData.unit,
                effectiveFrom: formData.effectiveFrom,
            };

            console.log(data);

            if (isEditing && editingServicePrice) {
                // Update existing service price
                const response = await apiInstance.put(`/ServiceCost/${editingServicePrice.id}`, data);
                if (response.data.succeeded) {
                    toast.success('Service price updated successfully');
                } else {
                    toast.error(response.data.message || 'Failed to update service price');
                }
            } else {
                // Add new service price
                const response = await apiInstance.post('/ServiceCost', data);
                if (response.data.succeeded) {
                    toast.success('Service price added successfully');
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
        } catch (error: any) {
            toast.error(error.response.data.message);
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
    };

    return (
        <ServiceModal isOpen={isOpen} onClose={onClose} title=" Quản lý giá dịch vụ">
            {/* Display current service prices */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Dịch vụ</th>
                        <th>Đơn giá</th>
                        <th>Đơn vị</th>
                        <th>Hiệu lực từ</th>
                        <th>Hiệu lực đến</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {servicePrices.length > 0 ? (
                        servicePrices.map((servicePrice: ServicePrice) => (
                            <tr key={servicePrice.id}>
                                <td>{servicePrice.serviceName}</td>
                                <td>{servicePrice.unitCost}</td>
                                <td>{servicePrice.unit}</td>
                                <td>{new Date(servicePrice.effectiveFrom).toLocaleDateString()}</td>
                                <td>{servicePrice.effectiveTo ? new Date(servicePrice.effectiveTo).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditButtonClick(servicePrice)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteServicePrice(servicePrice.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>
                                Không có dịch vụ nào cho nhà trọ này.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Form to add or edit service price */}
            <h4>{isEditing ? 'Cập nhật giá dịch vụ' : 'Thêm giá dịch vụ mới'}</h4>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label>Dịch vụ</label>
                    <select
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={isEditing}
                    >
                        <option value="">Chọn dịch vụ</option>
                        {availableServices.length > 0 ? (
                            availableServices.map((service: Service) => (
                                <option key={service.serviceId} value={service.serviceId}>
                                    {service.serviceName}
                                </option>
                            ))
                        ) : (
                            <option value="">Không có dịch vụ nào</option>
                        )}
                    </select>
                </div>
                <div className="form-group">
                    <label>Đơn giá</label>
                    <input
                        type="number"
                        name="unitCost"
                        value={formData.unitCost}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <label>Đơn vị</label>
                    <input
                        type="string"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Hiệu lực từ</label>
                    <input
                        type="date"
                        name="effectiveFrom"
                        value={formData.effectiveFrom}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary me-2">
                        {isEditing ? 'Cập nhật' : 'Thêm'}
                    </button>
                    {isEditing && (
                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                            Hủy
                        </button>
                    )}
                </div>
            </form>
        </ServiceModal>
    );
};

export default ServicePriceModal;