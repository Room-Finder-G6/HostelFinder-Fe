import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Spinner, Alert } from 'react-bootstrap';
import apiInstance from '@/utils/apiInstance';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClipboardList, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
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
        <Modal
            show={isOpen}
            onHide={onClose}
            dialogClassName="meter-modal"
            contentClassName="meter-modal-content"
            centered
        >
            <div className="meter-reading-container">
                {/* Notifications Section */}
                <div className="notifications-section">
                    <Alert variant="info" className="notification-card">
                        <div className="notification-content">
                            <FaInfoCircle className="notification-icon text-info" />
                            <div>
                                <strong>Lưu ý!</strong>
                                <p className="mb-0">Nếu số liệu của tháng trước không có thì sẽ lấy số liệu mới nhất được cập nhật</p>
                            </div>
                        </div>
                    </Alert>

                    <Alert variant="warning" className="notification-card">
                        <div className="notification-content">
                            <FaExclamationTriangle className="notification-icon text-warning" />
                            <div>
                                <strong>Chú ý!</strong>
                                <p className="mb-0">Nếu số liệu đã được ghi thì bạn chỉ có thể chỉnh sửa</p>
                            </div>
                        </div>
                    </Alert>
                </div>

                <Modal.Header closeButton className="meter-modal-header">
                    <Modal.Title>
                        <div className="d-flex align-items-center">
                            <FaClipboardList className="text-primary me-2" />
                            <span>Ghi số liệu dịch vụ</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="meter-modal-body">
                    {/* Billing Period Selection */}
                    <div className="billing-period">
                        <div className="section-title">
                            <FaCalendarAlt className="text-primary me-2" />
                            <span>Kỳ ghi số</span>
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
                                    />
                                    <label htmlFor="billingYear">Năm</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meter Readings Table */}
                    <div className="readings-section">
                        <div className="section-title">
                            <FaClipboardList className="text-primary me-2" />
                            <span>Số liệu dịch vụ</span>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <Spinner animation="border" variant="primary" />
                                <span>Đang tải dữ liệu...</span>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="meter-table">
                                    <thead>
                                        <tr>
                                            <th>Tên dịch vụ</th>
                                            <th className="text-end">Đơn giá (VND)</th>
                                            <th className="text-center">Số cũ</th>
                                            <th className="text-center">Số mới</th>
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
                                                <td className="text-end fw-medium">
                                                    {service.unitCost.toLocaleString('vi-VN')}
                                                </td>
                                                <td className="text-center">
                                                    <span className="previous-reading">
                                                        {service.previousReading}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="reading-input">
                                                        <Form.Control
                                                            type="number"
                                                            value={meterReadings.find(reading => reading.serviceId === service.serviceId)?.currentReading || 0}
                                                            onChange={(e) => handleReadingChange(service.serviceId, parseInt(e.target.value))}
                                                            min={0}
                                                            className="text-center"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer className="meter-modal-footer">
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
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="btn-save"
                    >
                        {saving ? (
                            <>
                                <Spinner animation="border" size="sm" />
                                <span className="ms-2">Đang lưu...</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-2"></i>
                                Lưu số liệu
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </div>

            <style jsx>{`
  /* Modal Container */
  :global(.modal-dialog) {
    max-width: 55vw !important;
    min-width: 900px !important;
    margin: 10px auto;
  }

  :global(.modal-content) {
    max-height: 120vh !important;  /* Thay đổi từ min-height sang max-height */
    border: none !important;
    border-radius: 20px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
    overflow: hidden !important;  /* Đảm bảo overflow được set */
  }

  /* Body content */
  :global(.modal-body) {
    max-height: calc(80vh - 200px) !important; /* Trừ đi phần header và footer */
    overflow-y: auto !important;  /* Cho phép scroll */
    padding: 2rem !important;
  }

  /* Billing Period Section - Fix layout */
  .billing-period {
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  /* Fix grid layout cho form controls */
  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin: 0 !important; /* Reset margin của Bootstrap */
  }

  /* Form floating fixes */
  :global(.form-floating) {
    margin-bottom: 1rem;
    position: relative;
  }

  :global(.form-floating > label) {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    padding: 1rem .75rem;
    pointer-events: none;
    border: 1px solid transparent;
    transform-origin: 0 0;
    transition: opacity .1s ease-in-out,transform .1s ease-in-out;
  }

  :global(.form-floating > .form-control) {
    height: calc(3.5rem + 2px) !important;
    padding: 1rem .75rem;
  }

  :global(.form-floating > .form-control:focus ~ label),
  :global(.form-floating > .form-control:not(:placeholder-shown) ~ label) {
    opacity: .65;
    transform: scale(.85) translateY(-0.5rem) translateX(0.15rem);
  }

  /* Table Section */
  .readings-section {
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .meter-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  /* Custom Scrollbar */
  :global(.modal-body::-webkit-scrollbar) {
    width: 8px;
  }

  :global(.modal-body::-webkit-scrollbar-track) {
    background: #f1f5f9;
  }

  :global(.modal-body::-webkit-scrollbar-thumb) {
    background: #cbd5e1;
    border-radius: 4px;
  }

  :global(.modal-body::-webkit-scrollbar-thumb:hover) {
    background: #94a3b8;
  }

  /* Responsive adjustments */
  @media (max-width: 1400px) {
    :global(.modal-dialog) {
      min-width: auto !important;
      max-width: 95vw !important;
    }
  }

  @media (max-width: 768px) {
    .row {
      grid-template-columns: 1fr;
    }

    :global(.modal-body) {
      padding: 1rem !important;
    }
  }
`}</style>
        </Modal>
    );
};

export default MeterReadingForm;
