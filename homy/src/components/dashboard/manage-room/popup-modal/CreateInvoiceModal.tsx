import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Spinner, Alert } from 'react-bootstrap';
import apiInstance from '@/utils/apiInstance';
import { toast } from 'react-toastify';

interface CreateInvoiceModalProps {
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

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, roomId, hostelId }) => {
    const [billingMonth, setBillingMonth] = useState<number>(new Date().getMonth() + 1);
    const [billingYear, setBillingYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<Service[]>([]);
    const [meterReadings, setMeterReadings] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [invoiceExists, setInvoiceExists] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, billingMonth, billingYear, roomId, hostelId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchServiceCosts(), checkInvoiceExists()]);
        } catch (error) {
            toast.error('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceCosts = async () => {
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
            toast.error('Lỗi khi lấy thông tin dịch vụ');
        }
    };

    const checkInvoiceExists = async () => {
        try {
            const response = await apiInstance.get(`/invoices/${hostelId}/${roomId}?month=${billingMonth}&year=${billingYear}`);
            setInvoiceExists(response.data.succeeded && response.data.data);
        } catch (error) {
            setInvoiceExists(false);
        }
    };

    const calculateTotalAmount = () => {
        let total = 0;
        meterReadings.forEach((reading) => {
            const service = services.find((service) => service.serviceId === reading.serviceId);
            if (service) {
                total += calculateServiceCost(service, reading);
            }
        });
        setTotalAmount(total);
    };

    const calculateServiceCost = (service: Service, reading: any) => {
        let serviceCost = 0;
        switch (service.chargingMethod) {
            case 0: // Flat Fee
                serviceCost = (reading.currentReading - reading.previousReading) * service.unitCost;
                break;
            case 1: // Per Person
                serviceCost = service.unitCost * 3; // Assuming 3 tenants
                break;
            case 2: // Per Usage Unit
                serviceCost = (reading.currentReading - reading.previousReading) * service.unitCost;
                break;
            case 3: // Fixed cost
                serviceCost = service.unitCost;
                break;
            default:
                serviceCost = 0;
                break;
        }
        return serviceCost;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const invoiceData = { roomId, billingMonth, billingYear };
            const response = await apiInstance.post('/invoices/monthly-invoice', invoiceData);
            if (response.data.succeeded) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || 'Lỗi khi tạo hóa đơn');
            }
            onClose();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        calculateTotalAmount();
    }, [meterReadings]);

    return (
        <Modal show={isOpen} onHide={onClose} centered size="lg">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark fw-bold">Tạo hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Show warning if invoice exists for the selected month */}
                    <div>
                        {invoiceExists ? (
                            <Alert variant="warning">
                                <strong>Chú ý!</strong> Bạn đã lập hóa đơn cho tháng {billingMonth}. Các thao tác dưới đây sẽ cập nhật lại hóa đơn.
                            </Alert>
                        ) : (
                            <Alert variant="success">
                                <strong>Chú ý!</strong> Bạn đang lập hóa đơn cho tháng {billingMonth}. Các thao tác dưới đây sẽ cập nhật lại hóa đơn.
                            </Alert>
                        )}
                    </div>
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

                    <h5 className="mt-4">Danh sách dịch vụ</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tên dịch vụ</th>
                                <th>Loại phí</th>
                                <th>Đơn giá (VND)</th>
                                <th>Đơn vị</th>
                                <th>Số cũ</th>
                                <th>Số mới</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.serviceId}>
                                    <td>{service.serviceName}</td>
                                    <td>{service.chargingMethod === 0 ? 'Tính theo đơn vị' :
                                        service.chargingMethod === 1 ? 'Theo người' :
                                            service.chargingMethod === 2 ? 'Miễn phí' :
                                                service.chargingMethod === 3 ? 'Chi phí cố định' :
                                                    'N/A'}</td>
                                    <td>{service.unitCost.toLocaleString()}</td>
                                    <td>{service.unit === 0 ? 'Miễn phí' :
                                        service.unit === 1 ? 'kWh' :
                                            service.unit === 2 ? 'Khối' :
                                                service.unit === 3 ? 'Người' :
                                                    service.unit === 4 ? 'Tháng' :
                                                        "N/A"}</td>
                                    <td>{service.previousReading}</td>
                                    <td>{service.currentReading}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h5 className="mt-3">Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <><Spinner animation="border" size="sm" /> Đang tạo...</>
                        ) : (
                            'Tạo hóa đơn dịch vụ'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateInvoiceModal;
