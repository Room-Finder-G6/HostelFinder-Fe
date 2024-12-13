import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Spinner, Alert } from 'react-bootstrap';
import apiInstance from '@/utils/apiInstance';
import { toast } from 'react-toastify';
import { Room } from '../Room';
import { FaCalendarAlt, FaFileInvoiceDollar, FaList, FaMoneyBillWave } from 'react-icons/fa';

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

interface RoomInvoice {
    hostelName: string | null;
    roomName: string | null;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, roomId, hostelId }) => {
    const [billingMonth, setBillingMonth] = useState<number>(new Date().getMonth() + 1);
    const [billingYear, setBillingYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<Service[]>([]);
    const [meterReadings, setMeterReadings] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [invoiceExists, setInvoiceExists] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomInvoice | null>(null);
    const [dataAvailable, setDataAvailable] = useState<boolean>(true);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, billingMonth, billingYear, roomId, hostelId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchServiceCosts(), checkInvoiceExists(), fetchRooms()]);
        } catch (error) {
            toast.error('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceCosts = async () => {
        try {
            const response = await apiInstance.get(`/meterReadings/${hostelId}/${roomId}?billingMonth=${billingMonth}&billingYear=${billingYear}`);
            if (response.data.succeeded && response.data.data.length > 0) {
                const servicesData = response.data.data;
                setServices(servicesData);
                setMeterReadings(
                    servicesData.map((service: Service) => ({
                        serviceId: service.serviceId,
                        currentReading: service.currentReading,
                        previousReading: service.previousReading,
                    }))
                );
                const hasZeroReading = servicesData.some((service: Service) => service.currentReading < service.previousReading);

                if (hasZeroReading) {
                    setDataAvailable(false);
                } else {
                    setDataAvailable(true);
                }

            } else {
                setServices([]);
                setMeterReadings([]);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy thông tin dịch vụ');
        }
    };

    const checkInvoiceExists = async () => {
        try {
            const response = await apiInstance.get(`/invoices/${hostelId}/${roomId}?month=${billingMonth}&year=${billingYear}`);
            if (response.status === 200) {
                setInvoiceExists(true);
            }
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

    const fetchRooms = async () => {
        try {
            const response = await apiInstance.get(`/rooms/${roomId}`);
            if (response.status === 200 && response.data.succeeded) {
                const room = response.data.data;
                setRooms(room);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
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
        <Modal
            show={isOpen}
            onHide={onClose}
            dialogClassName="modal-90w"
            contentClassName="invoice-modal"
            centered
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton className="invoice-modal-header">
                    <Modal.Title>
                        <div className="d-flex align-items-center">
                            <FaFileInvoiceDollar className="text-primary me-2 fs-3" />
                            <div>
                                <div className="modal-title-text">Tạo hóa đơn</div>
                                <div className="modal-subtitle">
                                    {rooms ? (
                                        <>
                                            <span className="fw-bold">{rooms.roomName}</span> -
                                            <span className="text-muted ms-1">{rooms.hostelName}</span>
                                        </>
                                    ) : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="invoice-modal-body">
                    {/* Status Alerts */}
                    <div className="alert-section">
                        {invoiceExists ? (
                            <Alert variant="warning" className="invoice-alert">
                                <div className="d-flex">
                                    <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
                                    <div>
                                        <div className="fw-bold">Đã tồn tại hóa đơn!</div>
                                        <div>Bạn đã lập hóa đơn cho tháng {billingMonth}. Thay đổi có thể được thực hiện ở phần ghi dịch vụ phòng.</div>
                                    </div>
                                </div>
                            </Alert>
                        ) : (
                            <Alert variant="info" className="invoice-alert">
                                <div className="d-flex">
                                    <i className="bi bi-info-circle-fill fs-4 me-2"></i>
                                    <div>
                                        <div className="fw-bold">Thông tin hóa đơn</div>
                                        <div>Bạn đang lập hóa đơn cho tháng {billingMonth}</div>
                                    </div>
                                </div>
                            </Alert>
                        )}

                        {!dataAvailable && (
                            <Alert variant="danger" className="invoice-alert">
                                <div className="d-flex">
                                    <i className="bi bi-x-circle-fill fs-4 me-2"></i>
                                    <div>
                                        <div className="fw-bold">Thiếu dữ liệu!</div>
                                        <div>Vui lòng nhập số liệu dịch vụ trước khi tạo hóa đơn.</div>
                                    </div>
                                </div>
                            </Alert>
                        )}
                    </div>

                    {/* Billing Period Selection */}
                    <div className="billing-period-section">
                        <div className="section-header">
                            <FaCalendarAlt className="text-primary me-2" />
                            <h6 className="mb-0">Kỳ thanh toán</h6>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <Form.Select
                                        id="billingMonth"
                                        value={billingMonth}
                                        onChange={(e) => setBillingMonth(parseInt(e.target.value))}
                                        required
                                        className="form-select"
                                    >
                                        {[...Array(12)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                Tháng {index + 1}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <label htmlFor="billingMonth">Tháng</label>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-floating">
                                    <Form.Control
                                        type="number"
                                        id="billingYear"
                                        value={billingYear}
                                        onChange={(e) => setBillingYear(parseInt(e.target.value))}
                                        required
                                        min="2000"
                                        max="2100"
                                        className="form-control"
                                    />
                                    <label htmlFor="billingYear">Năm</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services List */}
                    <div className="services-section">
                        <div className="section-header">
                            <FaList className="text-primary me-2" />
                            <h6 className="mb-0">Danh sách dịch vụ</h6>
                        </div>

                        <div className="table-responsive">
                            <table className="table invoice-table">
                                <thead>
                                    <tr>
                                        <th>Tên dịch vụ</th>
                                        <th>Loại phí</th>
                                        <th className="text-end">Đơn giá (VND)</th>
                                        <th>Đơn vị</th>
                                        <th className="text-end">Số cũ</th>
                                        <th className="text-end">Số mới</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((service) => (
                                        <tr key={service.serviceId}>
                                            <td>
                                                <div className="service-name">
                                                    <i className="bi bi-gear-fill text-primary me-2"></i>
                                                    {service.serviceName}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark">
                                                    {service.chargingMethod === 0 ? 'Tính theo đơn vị' :
                                                        service.chargingMethod === 1 ? 'Theo người' :
                                                            service.chargingMethod === 2 ? 'Miễn phí' :
                                                                service.chargingMethod === 3 ? 'Chi phí cố định' : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="text-end fw-medium">
                                                {service.unitCost.toLocaleString('vi-VN')}
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    {service.unit === 0 ? 'Miễn phí' :
                                                        service.unit === 1 ? 'kWh' :
                                                            service.unit === 2 ? 'Khối' :
                                                                service.unit === 3 ? 'Người' :
                                                                    service.unit === 4 ? 'Tháng' : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="text-end">{service.previousReading}</td>
                                            <td className="text-end">{service.currentReading}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total Amount */}
                        <div className="total-section">
                            <div className="d-flex align-items-center">
                                <FaMoneyBillWave className="text-success me-2 fs-4" />
                                <div>
                                    <small className="text-muted">Tổng tiền</small>
                                    <div className="total-amount">
                                        {totalAmount < 0 ? 'N/A' : `${totalAmount.toLocaleString()} VND`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="invoice-modal-footer">
                    <Button
                        variant="light"
                        onClick={onClose}
                        className="btn-cancel"
                    >
                        <i className="bi bi-x-lg me-2"></i>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading || !dataAvailable || totalAmount < 0}
                        className="btn-submit"
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" />
                                <span className="ms-2">Đang tạo...</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-2"></i>
                                Tạo hóa đơn
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>

            <style jsx>{`
          .modal-90w {
            width: 90%;
            max-width: 1000px;
          }
  
          .invoice-modal {
            border-radius: 16px;
            border: none;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
  
          .invoice-modal-header {
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 1.5rem;
          }
  
          .modal-title-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
          }
  
          .modal-subtitle {
            font-size: 0.875rem;
            color: #64748b;
            margin-top: 0.25rem;
          }
  
          .invoice-modal-body {
            padding: 1.5rem;
          }
  
          .alert-section {
            margin-bottom: 2rem;
          }
  
          .invoice-alert {
            margin-bottom: 1rem;
            border: none;
            border-radius: 12px;
          }
  
          .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e2e8f0;
          }
  
          .billing-period-section,
          .services-section {
            background: #fff;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
  
          .form-floating > label {
            color: #64748b;
          }
  
          .invoice-table {
            margin: 0;
          }
  
          .invoice-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #64748b;
            border-bottom: 2px solid #e2e8f0;
            white-space: nowrap;
            padding: 1rem;
          }
  
          .invoice-table td {
            padding: 1rem;
            vertical-align: middle;
          }
  
          .service-name {
            display: flex;
            align-items: center;
          }
  
          .total-section {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e2e8f0;
          }
  
          .total-amount {
            font-size: 1.5rem;
            font-weight: 600;
            color: #10b981;
          }
  
          .invoice-modal-footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 1rem 1.5rem;
          }
  
          .btn-cancel,
          .btn-submit {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
          }
  
          @media (max-width: 768px) {
            .modal-90w {
              width: 95%;
            }
  
            .invoice-modal-header,
            .invoice-modal-body,
            .invoice-modal-footer {
              padding: 1rem;
            }
  
            .billing-period-section,
            .services-section {
              padding: 1rem;
            }
          }
        `}</style>
        </Modal>
    );
};

export default CreateInvoiceModal;
