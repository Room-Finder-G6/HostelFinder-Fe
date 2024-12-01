import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Spinner, Alert } from 'react-bootstrap';
import apiInstance from '@/utils/apiInstance';
import { toast } from 'react-toastify';

interface MeterReadingFormProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    hostelId: string;
}

interface Service {
    serviceId: string;
    serviceName: string;
    unitCost: number;
    previousReading: number;
    currentReading: number;
    unit: number;
    chargingMethod: number;
}

const MeterReadingForm: React.FC<MeterReadingFormProps> = ({ isOpen, onClose, roomId, hostelId }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [meterReadings, setMeterReadings] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [billingMonth, setBillingMonth] = useState<number>(new Date().getMonth() + 1);  // Default to current month
    const [billingYear, setBillingYear] = useState<number>(new Date().getFullYear());  // Default to current year

    useEffect(() => {
        if (isOpen) {
            fetchServiceCosts();
        }
    }, [isOpen, roomId, hostelId, billingMonth, billingYear]);  // Re-fetch data when month or year changes

    const fetchServiceCosts = async () => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/meterReadings/${hostelId}/${roomId}?billingMonth=${billingMonth}&billingYear=${billingYear}`);
            if (response.data.succeeded) {
                const servicesData = response.data.data;
                setServices(servicesData);
                setMeterReadings(
                    servicesData.map((service: Service) => ({
                        serviceId: service.serviceId,
                        currentReading: service.currentReading,
                        previousReading: service.previousReading,
                    }))
                );
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error fetching service costs');
        } finally {
            setLoading(false);
        }
    };

    const handleReadingChange = (serviceId: string, value: number) => {
        setMeterReadings(prevReadings =>
            prevReadings.map(reading =>
                reading.serviceId === serviceId ? { ...reading, currentReading: value } : reading
            )
        );
    };

    // Handle save meter readings to API
    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = meterReadings.map(reading => ({
                roomId,
                serviceId: reading.serviceId,
                previousReading: reading.previousReading,
                currentReading: reading.currentReading,
                billingMonth,
                billingYear,
            }));

            const response = await apiInstance.post(`/meterReadings/list`, payload);

            if (response.data.succeeded) {
                toast.success(response.data.message);
                console.log(response)
                onClose();
            } else {
                toast.error('Không thể lưu số liệu, vui lòng thử lại.');
            }
        } catch (error: any) {
            toast.error(error.response.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose} centered size="lg">
            <Alert variant="success">
                <strong>Lưu ý!</strong> Nếu số liệu của tháng trước không có thì sẽ lấy số liệu mới nhất được cập nhật
            </Alert>
            <Alert variant="warning">
                <strong>Chú ý!</strong> Nếu số liệu đã được ghi thì bạn chỉ cho thể chỉnh sửa
            </Alert>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark fw-bold">Ghi số liệu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Billing Month and Year form fields */}
                <Form.Group controlId="billingMonth">
                    <Form.Label>Tháng</Form.Label>
                    <Form.Control
                        as="select"
                        value={billingMonth}
                        onChange={(e) => setBillingMonth(parseInt(e.target.value))}
                        required
                    >
                        {[...Array(12)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="billingYear">
                    <Form.Label>Năm</Form.Label>
                    <Form.Control
                        type="number"
                        value={billingYear}
                        onChange={(e) => setBillingYear(parseInt(e.target.value))}
                        required
                        min="2000"
                        max="2100"
                    />
                </Form.Group>

                {/* Table of services */}
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tên dịch vụ</th>
                                <th>Đơn giá (VND)</th>
                                <th>Số cũ</th>
                                <th>Số mới</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.serviceId}>
                                    <td>{service.serviceName}</td>
                                    <td>{service.unitCost.toLocaleString('vi-VN')}</td>
                                    <td>{service.previousReading}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={meterReadings.find(reading => reading.serviceId === service.serviceId)?.currentReading || 0}
                                            onChange={(e) =>
                                                handleReadingChange(service.serviceId, parseInt(e.target.value))
                                            }
                                            min={0}
                                            disabled={meterReadings.find(reading => reading.serviceId === service.serviceId)?.currentReading !== 0}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={saving || loading}>
                    {saving ? <Spinner animation="border" size="sm" /> : 'Lưu số liệu'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MeterReadingForm;
