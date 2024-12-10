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
        <ServiceModal isOpen={isOpen} onClose={onClose} title=" Quản lý giá dịch vụ">
            {/* Display current service prices */}
            <div className="alert alert-warning mt-2" role="alert">
                <div>
                    <i className="bi-exclamation-triangle-fill me-2"></i>Chú ý:
                </div>
                Nếu bạn sửa giá của 1 dịch vụ đang áp dụng, giá sẽ được áp dụng cho các hoá đơn được tạo ra sau lần sửa này. Các hoá đơn cũ không thay đổi.
            </div>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope='col'>Dịch vụ</th>
                        <th className="text-end">Đơn giá</th>
                        <th>Đơn vị</th>
                        <th>Hiệu lực từ</th>
                        <th>Hiệu lực đến</th>
                        <th className="text-center">Hành động</th>
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
                                    <td>{servicePrice.serviceName}</td>
                                    <td className="text-end">
                                        {servicePrice.unitCost === 0
                                            ? 'Miễn phí'
                                            : formattedUnitCost}
                                    </td>
                                    <td>{servicePrice.unitCost === 0 ? 'N/A' : getUnitLabel(servicePrice.unit)}</td>
                                    <td>{formatDate(servicePrice.effectiveFrom)}</td>
                                    <td>{servicePrice.effectiveTo ? formatDate(servicePrice.effectiveTo) : 'N/A'}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleEditButtonClick(servicePrice)}
                                            title="Chỉnh sửa"
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteServicePrice(servicePrice.id)}
                                            title="Xóa"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
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
                    <label>
                        <input
                            type="checkbox"
                            checked={isFree}
                            onChange={handleIsFreeChange}
                            className="me-2"
                        />
                        Miễn phí
                    </label>
                </div>
                <div className="form-group">
                    <label>Đơn giá</label>
                    {isFree ? (
                        <p className="form-control-static">Miễn phí</p>
                    ) : (
                        <input
                            type="number"
                            name="unitCost"
                            value={formData.unitCost}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            min="0"
                        />
                    )}
                </div>
                {!isFree && (
                    <div className="form-group">
                        <label>Đơn vị</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        >
                            <option value="">Chọn đơn vị</option>
                            {unitOptions.map((unit) => (
                                <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
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
