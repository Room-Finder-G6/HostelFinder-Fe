import React, { useEffect, useState } from "react";
import { Modal, Tabs, Tab, Table, Button, Form } from 'react-bootstrap';
import { FaBed, FaBolt, FaBuilding, FaCalendarAlt, FaCheckCircle, FaClipboardList, FaComments, FaCrown, FaEdit, FaEnvelope, FaFileContract, FaFileInvoiceDollar, FaIdCard, FaMapMarkerAlt, FaMoneyBillWave, FaPhone, FaRulerCombined, FaSignOutAlt, FaTimes, FaTimesCircle, FaTrash, FaUser, FaUsers, FaWater, FaWifi, FaWrench } from "react-icons/fa";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import "./css/RoomDetailsModal.css"
import UpdateTenantModal from "./UpdateTenantModal";
// import DatePicker from "react-datepicker";
interface RoomDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
}

interface RoomInfoDetail {
    roomId: string;
    roomName: string;
    floor: number;
    maxRenters: number;
    numberOfCustomer: number;
    size: number;
    isAvailable: boolean;
    monthlyRentCost: number;
    roomType: number;
}

interface Tenant {
    tenantId: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    province: string;
    identityCardNumber: string;
    description: string | null;
    moveInDate: string;
}

interface InvoiceDetailItem {
    invoiceId: string;
    serviceName: string;
    unitCost: number;
    actualCost: number;
    numberOfCustomer: number;
    previousReading: number;
    currentReading: number;
    isRentRoom: boolean;
    billingDate: string;
}

interface InvoiceDetail {
    id: string;
    billingMonth: number;
    billingYear: number;
    totalAmount: number;
    isPaid: boolean;
    invoiceDetails: InvoiceDetailItem[];
}

interface ContractDetail {
    id: string | null;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
    paymentCycleDays: number;
    contractTerms: string | null;
}

interface RoomRepairHistory {
    // Định nghĩa cấu trúc dựa trên lịch sử sửa chữa từ API của bạn
}

interface RoomDetailsData {
    roomInfoDetail: RoomInfoDetail;
    pictureRoom: string[];
    infomationTenacy: Tenant[];
    invoiceDetailInRoom: InvoiceDetail | null;
    contractDetailInRoom: ContractDetail | null;
    roomRepairHostory: RoomRepairHistory | null;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ isOpen, onClose, roomId }) => {
    const [roomDetails, setRoomDetails] = useState<RoomDetailsData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("general");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [contractIdToTerminate, setContractIdToTerminate] = useState<string | null>(null);
    const [showExtendModal, setShowExtendModal] = useState(false);
    const [newEndDate, setNewEndDate] = useState<Date | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');
    useEffect(() => {
        if (isOpen && roomId) {
            fetchRoomDetails();
        }
    }, [isOpen, roomId]);
    const handleShowConfirmModal = (id: string) => {
        setContractIdToTerminate(id);
        setShowConfirmModal(true);
    };
    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setContractIdToTerminate(null);
    };
    const handleExtendContract = (contractId: string) => {
        setShowExtendModal(true);
    };

    const handleCloseExtendModal = () => {
        setShowExtendModal(false);
        setNewEndDate(null);
    };


    const fetchRoomDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiInstance.get(`/rooms/info-detail`, {
                params: { roomId }
            });
            if (response.data.succeeded) {
                setRoomDetails(response.data.data);
            } else {
                setError('Không thể tải thông tin phòng.');
                toast.error("Không thể tải thông tin phòng.", { position: "top-center" });
            }
        } catch (error: any) {
            console.error("Error fetching room details:", error);
            setError('Có lỗi xảy ra khi tải thông tin phòng.');
            toast.error("Có lỗi xảy ra khi tải thông tin phòng.", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    function getRoomType(roomType: number): React.ReactNode {
        switch (roomType) {
            case 1:
                return "Phòng trọ";
            case 2:
                return "Chung cư";
            case 3:
                return "Chung cư mini";
            default:
                return "Không xác định";
        }
    }
    const handleEndContract = async () => {
        if (!contractIdToTerminate) return;

        setLoading(true);
        setError(null);

        try {
            const response = await apiInstance.post(
                "/rental-contracts/termination-of-contract",
                { contractId: contractIdToTerminate }
            );

            if (response.status === 200 && response.data.succeeded) {
                toast.success(response.data.message, { position: "top-center" });
                fetchRoomDetails();
            }
        } catch (error: any) {
            toast.error("Có lỗi xảy ra khi chấm dứt hợp đồng", { position: "top-center" });
        } finally {
            setLoading(false);
            handleCloseConfirmModal();
        }
    };
    const handleConfirmExtend = async () => {
        if (!roomDetails?.contractDetailInRoom?.id || !newEndDate) return;

        setLoading(true);
        setError(null);

        const formattedDate = newEndDate.toISOString(); // Hoặc định dạng phù hợp với API

        try {
            const response = await apiInstance.post('/rental-contracts/contract-extension', {
                rentalContractId: roomDetails.contractDetailInRoom.id,
                newEndDate: formattedDate,
            });

            if (response.data.succeeded) {
                toast.success(response.data.message, { position: "top-center" });
                fetchRoomDetails(); // Cập nhật lại thông tin phòng
                handleCloseExtendModal();
            } else {
                toast.error(response.data.message || "Gia hạn hợp đồng thất bại.", { position: "top-center" });
            }
        } catch (error: any) {
            console.error("Error extending contract:", error);
            toast.error("Có lỗi xảy ra khi gia hạn hợp đồng.", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    const getServiceIcon = (serviceName: string) => {
        const name = serviceName.toLowerCase();
        if (name.includes('nước')) return <FaWater className="text-info" />;
        if (name.includes('điện')) return <FaBolt className="text-warning" />;
        if (name.includes('wifi') || name.includes('internet')) return <FaWifi className="text-primary" />;
        if (name.includes('rác')) return <FaTrash className="text-success" />;
        return <FaFileInvoiceDollar className="text-secondary" />;
    };




    const handleUpdateTenant = (tenantId: string) => {
        console.log('Opening modal for tenant:', tenantId);
        setSelectedTenantId(tenantId);
        setShowUpdateModal(true);
    };

    const onLeaveTenant = (tenantId: string, roomId: string) => {
        console.log('Opening modal for tenant:', tenantId);
        console.log("RoomId : ", roomId);
        setSelectedTenantId(tenantId);
    };

    const handleUpdateSuccess = () => {
        setShowUpdateModal(false);
    };
    const handleCloseUpdateSuccess = () => {
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="xl" dialogClassName="modal-150w" contentClassName="modal-custom" centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark fw-bold modal-120w">Thông tin phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                {loading ? (
                    <Loading />
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : roomDetails ? (
                    <div>
                        {/* Tabs */}
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k || "general")}
                            className="mb-3"
                        >
                            <Tab eventKey="general" title={<span><FaClipboardList className="me-2" />Thông tin chung</span>}>
                                <div className="p-4">
                                    <div className="row g-4">
                                        {/* Thẻ thông tin chính */}
                                        <div className="col-md-8">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body">
                                                    <h5 className="card-title border-bottom pb-3 mb-4">
                                                        <FaClipboardList className="me-2 text-primary" />
                                                        Chi tiết phòng
                                                    </h5>

                                                    <div className="row g-4">
                                                        {/* Tên phòng */}
                                                        <div className="col-md-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="icon-wrapper bg-light rounded-circle p-3 me-3">
                                                                    <FaBed className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-muted small">Tên phòng</div>
                                                                    <div className="fw-bold">{roomDetails.roomInfoDetail.roomName}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Tầng */}
                                                        <div className="col-md-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="icon-wrapper bg-light rounded-circle p-3 me-3">
                                                                    <FaBuilding className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-muted small">Tầng</div>
                                                                    <div className="fw-bold">{roomDetails.roomInfoDetail.floor}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Diện tích */}
                                                        <div className="col-md-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="icon-wrapper bg-light rounded-circle p-3 me-3">
                                                                    <FaRulerCombined className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-muted small">Diện tích</div>
                                                                    <div className="fw-bold">{roomDetails.roomInfoDetail.size} m²</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Số người */}
                                                        <div className="col-md-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="icon-wrapper bg-light rounded-circle p-3 me-3">
                                                                    <FaUsers className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-muted small">Số người thuê</div>
                                                                    <div className="fw-bold">
                                                                        {roomDetails.roomInfoDetail.numberOfCustomer} / {roomDetails.roomInfoDetail.maxRenters}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Thông tin bổ sung */}
                                                    <div className="mt-4">
                                                        <div className="row g-3">
                                                            <div className="col-md-6">
                                                                <div className="p-3 bg-light rounded">
                                                                    <div className="text-muted small mb-1">Trạng thái</div>
                                                                    <span className={`badge ${roomDetails.roomInfoDetail.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                                                                        {roomDetails.roomInfoDetail.isAvailable ? "Còn trống" : "Đã thuê"}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="p-3 bg-light rounded">
                                                                    <div className="text-muted small mb-1">Loại phòng</div>
                                                                    <span className="badge bg-primary">
                                                                        {getRoomType(roomDetails.roomInfoDetail.roomType)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="col-12">
                                                                <div className="p-3 bg-light rounded">
                                                                    <div className="text-muted small mb-1">Giá thuê hàng tháng</div>
                                                                    <div className="fw-bold text-primary fs-4">
                                                                        {new Intl.NumberFormat('vi-VN').format(roomDetails.roomInfoDetail.monthlyRentCost)} đ
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thẻ hình ảnh */}
                                        <div className="col-md-4">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body">
                                                    <h5 className="card-title border-bottom pb-3 mb-4">
                                                        <i className="bi bi-images me-2 text-primary"></i>
                                                        Hình ảnh phòng
                                                    </h5>

                                                    <div className="room-gallery">
                                                        {roomDetails.pictureRoom.length > 0 ? (
                                                            <div className="row g-2">
                                                                {roomDetails.pictureRoom.map((url, index) => (
                                                                    <div key={index} className="col-6">
                                                                        <div className="position-relative image-hover-zoom">
                                                                            <img
                                                                                src={url}
                                                                                alt={`Hình ảnh phòng ${index + 1}`}
                                                                                className="img-fluid rounded"
                                                                                style={{ aspectRatio: '1', objectFit: 'cover' }}
                                                                            />
                                                                            <div className="image-overlay">
                                                                                <button className="btn btn-sm btn-light">
                                                                                    <i className="bi bi-zoom-in"></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-muted py-4">
                                                                <i className="bi bi-camera-slash fs-1"></i>
                                                                <p className="mt-2">Chưa có hình ảnh</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="tenants" title={<span><FaUser className="me-2" />Khách thuê trọ</span>}>
                                <div className="p-4">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                                                <h5 className="card-title d-flex align-items-center m-0">
                                                    <FaUser className="me-2 text-primary" />
                                                    Danh sách khách thuê
                                                </h5>
                                                <span className="badge bg-primary">
                                                    {roomDetails.infomationTenacy.length} người
                                                </span>
                                            </div>

                                            {roomDetails.infomationTenacy.length > 0 ? (
                                                <div className="tenants-grid">
                                                    {roomDetails.infomationTenacy.map((tenant, index) => (
                                                        <div key={index} className="tenant-card card border-0 shadow-sm">
                                                            <div className="card-body p-3">
                                                                {/* Header with Avatar and Status */}
                                                                <div className="d-flex align-items-center mb-3">
                                                                    <div className="position-relative">
                                                                        <img
                                                                            src={tenant.avatarUrl}
                                                                            alt={tenant.fullName}
                                                                            className="tenant-avatar"
                                                                        />
                                                                        {index === 0 && (
                                                                            <div className="representative-badge">
                                                                                <FaCrown className="text-warning" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="ms-2">
                                                                        <h6 className="mb-1 fw-bold">{tenant.fullName}</h6>
                                                                        <div className="tenant-badges">
                                                                            {index === 0 && (
                                                                                <>
                                                                                    <span className="badge bg-warning text-dark me-1">
                                                                                        <small>Đại diện</small>
                                                                                    </span>
                                                                                    <span className="badge bg-info">
                                                                                        <small>Liên hệ chính</small>
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Quick Info */}
                                                                <div className="tenant-info">
                                                                    <div className="quick-info">
                                                                        <div className="info-row">
                                                                            <FaPhone className="text-muted" />
                                                                            <small>{tenant.phone}</small>
                                                                        </div>
                                                                        <div className="info-row">
                                                                            <FaEnvelope className="text-muted" />
                                                                            <small>{tenant.email}</small>
                                                                        </div>
                                                                        <div className="info-row">
                                                                            <FaIdCard className="text-muted" />
                                                                            <small>{tenant.identityCardNumber}</small>
                                                                        </div>
                                                                        <div className="info-row">
                                                                            <FaMapMarkerAlt className="text-muted" />
                                                                            <small>{tenant.province}</small>
                                                                        </div>
                                                                        <div className="info-row">
                                                                            <FaCalendarAlt className="text-muted" />
                                                                            <small>{new Date(tenant.moveInDate).toLocaleDateString('vi-VN')}</small>
                                                                        </div>
                                                                    </div>

                                                                    {tenant.description && (
                                                                        <div className="description mt-2">
                                                                            <small className="text-muted d-block">Ghi chú:</small>
                                                                            <small className="text-truncate d-block">{tenant.description}</small>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="action-buttons mt-3 pt-3 border-top">
                                                                    <button
                                                                        className="btn btn-outline-primary btn-sm me-2"
                                                                        onClick={() => handleUpdateTenant(tenant.tenantId)}
                                                                    >
                                                                        <FaEdit className="me-1" />
                                                                        Cập nhật
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => onLeaveTenant(tenant.tenantId, roomDetails.roomInfoDetail.roomId)}
                                                                    >
                                                                        <FaSignOutAlt className="me-1" />
                                                                        Rời phòng
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <div className="empty-state">
                                                        <div className="empty-state-icon mb-3">
                                                            <FaUser className="text-muted" />
                                                        </div>
                                                        <h6 className="text-muted">Chưa có khách thuê</h6>
                                                        <p className="text-muted small mb-0">
                                                            Phòng này hiện chưa có khách thuê nào.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="invoices" title={<span><FaFileInvoiceDollar className="me-2" />Lịch sử hóa đơn</span>}>
                                <div className="p-4">
                                    {roomDetails.invoiceDetailInRoom ? (
                                        <div className="row g-4">
                                            {/* Thông tin tổng quan */}
                                            <div className="col-md-4">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-body">
                                                        <h5 className="card-title border-bottom pb-3 d-flex align-items-center">
                                                            <FaFileInvoiceDollar className="text-primary me-2" />
                                                            Thông tin hóa đơn
                                                        </h5>

                                                        <div className="invoice-summary">
                                                            <div className="summary-item">
                                                                <div className="label text-muted">Mã hóa đơn</div>
                                                                <div className="value fw-bold">{roomDetails.invoiceDetailInRoom.id}</div>
                                                            </div>

                                                            <div className="summary-item">
                                                                <div className="label text-muted">
                                                                    <FaCalendarAlt className="me-2" />
                                                                    Kỳ hóa đơn
                                                                </div>
                                                                <div className="value">
                                                                    Tháng {roomDetails.invoiceDetailInRoom.billingMonth}/{roomDetails.invoiceDetailInRoom.billingYear}
                                                                </div>
                                                            </div>

                                                            <div className="summary-item">
                                                                <div className="label text-muted">
                                                                    <FaMoneyBillWave className="me-2" />
                                                                    Tổng tiền
                                                                </div>
                                                                <div className="value fs-4 fw-bold text-primary">
                                                                    {new Intl.NumberFormat('vi-VN').format(roomDetails.invoiceDetailInRoom.totalAmount)} đ
                                                                </div>
                                                            </div>

                                                            <div className="summary-item">
                                                                <div className="label text-muted">Trạng thái</div>
                                                                <div className="value">
                                                                    {roomDetails.invoiceDetailInRoom.isPaid ? (
                                                                        <div className="d-flex align-items-center text-success">
                                                                            <FaCheckCircle className="me-2" />
                                                                            Đã thanh toán
                                                                        </div>
                                                                    ) : (
                                                                        <div className="d-flex align-items-center text-danger">
                                                                            <FaTimesCircle className="me-2" />
                                                                            Chưa thanh toán
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chi tiết hóa đơn */}
                                            <div className="col-md-8">
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body">
                                                        <h5 className="card-title border-bottom pb-3 d-flex align-items-center">
                                                            <FaFileInvoiceDollar className="text-primary me-2" />
                                                            Chi tiết dịch vụ
                                                        </h5>

                                                        <div className="table-responsive">
                                                            <table className="table table-hover align-middle">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th>Dịch vụ</th>
                                                                        <th className="text-end">Đơn giá</th>
                                                                        <th className="text-end">Chi phí</th>
                                                                        <th className="text-center">KH</th>
                                                                        <th className="text-center">Chỉ số</th>
                                                                        <th className="text-center">Ngày lập</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {roomDetails.invoiceDetailInRoom.invoiceDetails.map((detail, index) => (
                                                                        <tr key={index}>
                                                                            <td>
                                                                                <div className="d-flex align-items-center">
                                                                                    {getServiceIcon(detail.serviceName)}
                                                                                    <span className="ms-2">{detail.serviceName}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="text-end">
                                                                                <small className="text-muted">
                                                                                    {new Intl.NumberFormat('vi-VN').format(detail.unitCost)} đ
                                                                                </small>
                                                                            </td>
                                                                            <td className="text-end fw-bold">
                                                                                {new Intl.NumberFormat('vi-VN').format(detail.actualCost)} đ
                                                                            </td>
                                                                            <td className="text-center">
                                                                                <span className="badge bg-info">
                                                                                    {detail.numberOfCustomer}
                                                                                </span>
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {detail.previousReading !== 0 && detail.currentReading !== 0 ? (
                                                                                    <div className="meter-reading">
                                                                                        <small className="text-muted">
                                                                                            {detail.previousReading} → {detail.currentReading}
                                                                                        </small>
                                                                                        <div className="usage-badge">
                                                                                            <small>
                                                                                                {detail.currentReading - detail.previousReading} đơn vị
                                                                                            </small>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="badge bg-secondary">N/A</span>
                                                                                )}
                                                                            </td>
                                                                            <td className="text-center text-muted">
                                                                                <small>
                                                                                    {new Date(detail.billingDate).toLocaleDateString('vi-VN')}
                                                                                </small>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <div className="empty-state">
                                                <div className="empty-state-icon mb-3">
                                                    <FaFileInvoiceDollar className="text-muted" />
                                                </div>
                                                <h6 className="text-muted">Không có hóa đơn</h6>
                                                <p className="text-muted small mb-0">
                                                    Chưa có hóa đơn nào được tạo cho phòng này.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Tab>
                            <Tab eventKey="contracts" title={<span><FaClipboardList className="me-2" />Lịch sử hợp đồng</span>}>
                                {/* Lịch sử hợp đồng */}
                                <section className="mb-3">
                                    <h5>Lịch sử hợp đồng</h5>
                                    {roomDetails.contractDetailInRoom ? (
                                        <div>
                                            {/* Contract Information Display */}
                                            <div className="contract-info-container">
                                                <div className="row g-4">
                                                    {/* Thông tin thời gian */}
                                                    <div className="col-md-6">
                                                        <div className="info-card">
                                                            <div className="card-header">
                                                                <i className="bi bi-calendar-event text-primary"></i>
                                                                <h6 className="mb-0">Thời gian hợp đồng</h6>
                                                            </div>
                                                            <div className="card-content">
                                                                <div className="timeline">
                                                                    <div className="timeline-item">
                                                                        <div className="timeline-point bg-success"></div>
                                                                        <div className="timeline-content">
                                                                            <small className="text-muted">Ngày bắt đầu</small>
                                                                            <div className="fw-bold">
                                                                                {new Date(roomDetails.contractDetailInRoom.startDate).toLocaleDateString('vi-VN')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="timeline-item">
                                                                        <div className="timeline-point bg-danger"></div>
                                                                        <div className="timeline-content">
                                                                            <small className="text-muted">Ngày kết thúc</small>
                                                                            <div className="fw-bold">
                                                                                {roomDetails.contractDetailInRoom.endDate
                                                                                    ? new Date(roomDetails.contractDetailInRoom.endDate).toLocaleDateString('vi-VN')
                                                                                    : <span className="badge bg-warning text-dark">Chưa xác định</span>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Thông tin tài chính */}
                                                    <div className="col-md-6">
                                                        <div className="info-card">
                                                            <div className="card-header">
                                                                <i className="bi bi-wallet2 text-primary"></i>
                                                                <h6 className="mb-0">Thông tin tài chính</h6>
                                                            </div>
                                                            <div className="card-content">
                                                                <div className="finance-info">
                                                                    <div className="finance-item">
                                                                        <div className="icon-box bg-primary bg-opacity-10">
                                                                            <i className="bi bi-cash text-primary"></i>
                                                                        </div>
                                                                        <div>
                                                                            <small className="text-muted">Tiền thuê tháng</small>
                                                                            <div className="amount">
                                                                                {new Intl.NumberFormat('vi-VN').format(roomDetails.contractDetailInRoom.monthlyRent)} đ
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="finance-item">
                                                                        <div className="icon-box bg-success bg-opacity-10">
                                                                            <i className="bi bi-shield-check text-success"></i>
                                                                        </div>
                                                                        <div>
                                                                            <small className="text-muted">Tiền đặt cọc</small>
                                                                            <div className="amount">
                                                                                {new Intl.NumberFormat('vi-VN').format(roomDetails.contractDetailInRoom.depositAmount)} đ
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Chu kỳ thanh toán */}
                                                    <div className="col-md-6">
                                                        <div className="info-card">
                                                            <div className="card-header">
                                                                <i className="bi bi-clock-history text-primary"></i>
                                                                <h6 className="mb-0">Chu kỳ thanh toán</h6>
                                                            </div>
                                                            <div className="card-content">
                                                                <div className="payment-cycle">
                                                                    <div className="cycle-number">
                                                                        {roomDetails.contractDetailInRoom.paymentCycleDays}
                                                                    </div>
                                                                    <div className="cycle-text">tháng/lần</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Điều khoản hợp đồng */}
                                                    {roomDetails.contractDetailInRoom.contractTerms && (
                                                        <div className="col-12">
                                                            <div className="info-card">
                                                                <div className="card-header">
                                                                    <i className="bi bi-file-text text-primary"></i>
                                                                    <h6 className="mb-0">Điều khoản hợp đồng</h6>
                                                                </div>
                                                                <div className="card-content">
                                                                    <div className="terms-content">
                                                                        {roomDetails.contractDetailInRoom.contractTerms}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <p hidden><strong>Id:</strong> {roomDetails.contractDetailInRoom.id}</p>
                                            </div>
                                            <div className="contract-actions mt-4 d-flex flex-wrap gap-3">
                                                {roomDetails?.contractDetailInRoom?.id && (
                                                    <>
                                                        {/* Kết thúc hợp đồng */}
                                                        <button
                                                            className="btn btn-soft-danger btn-action"
                                                            onClick={() => handleShowConfirmModal(roomDetails.contractDetailInRoom!.id!)}
                                                        >
                                                            <div className="btn-content">
                                                                <div className="icon-wrapper">
                                                                    <i className="bi bi-file-earmark-x"></i>
                                                                </div>
                                                                <div className="text-content">
                                                                    <span className="action-title">Kết thúc hợp đồng</span>
                                                                    <small className="action-desc">Thanh lý hợp đồng hiện tại</small>
                                                                </div>
                                                            </div>
                                                        </button>

                                                        {/* Gia hạn hợp đồng */}
                                                        <button
                                                            className="btn btn-soft-success btn-action"
                                                            onClick={() => handleExtendContract(roomDetails.contractDetailInRoom!.id!)}
                                                            disabled={loading}
                                                        >
                                                            <div className="btn-content">
                                                                <div className="icon-wrapper">
                                                                    <i className="bi bi-arrow-clockwise"></i>
                                                                </div>
                                                                <div className="text-content">
                                                                    <span className="action-title">Gia hạn hợp đồng</span>
                                                                    <small className="action-desc">Kéo dài thời hạn hợp đồng</small>
                                                                </div>
                                                            </div>
                                                            {loading && (
                                                                <div className="spinner-wrapper">
                                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* Modal xác nhận */}
                                            <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
                                                <Modal.Header closeButton style={{ backgroundColor: 'white' }}>
                                                    <Modal.Title style={{ color: 'black' }}>Xác nhận</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <p>Bạn có chắc chắn muốn thanh lý hợp đồng này không?</p>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleCloseConfirmModal}>
                                                        Hủy
                                                    </Button>
                                                    <Button variant="danger" onClick={handleEndContract} disabled={loading}>
                                                        {loading ? "Đang xử lý..." : "Thanh lý hợp đồng"}
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                            {/* Modal Gia hạn hợp đồng */}
                                            <Modal show={showExtendModal} onHide={handleCloseExtendModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title style={{ color: 'black' }}>Gia hạn hợp đồng</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Form>
                                                        <Form.Group controlId="newEndDate">
                                                            <Form.Label>Ngày kết thúc mới</Form.Label>
                                                            <input
                                                                type="date"
                                                                value={newEndDate ? newEndDate.toISOString().split('T')[0] : ''}
                                                                onChange={(e) => setNewEndDate(new Date(e.target.value))}
                                                                className="form-control"
                                                                min={roomDetails?.contractDetailInRoom?.endDate
                                                                    ? new Date(roomDetails.contractDetailInRoom.endDate).toISOString().split('T')[0]
                                                                    : new Date().toISOString().split('T')[0]}
                                                                placeholder="Chọn ngày kết thúc mới"
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleCloseExtendModal}>
                                                        Hủy
                                                    </Button>
                                                    <Button variant="primary" onClick={handleConfirmExtend} disabled={!newEndDate || loading}>
                                                        {loading ? "Đang xử lý..." : "Gia hạn"}
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </div>
                                    ) : (
                                        <div className="p-4">
                                            <div className="text-center py-5">
                                                <div className="empty-state">
                                                    <div className="empty-state-icon mb-3">
                                                        <FaFileContract className="text-muted" />
                                                    </div>
                                                    <h6 className="text-muted">Không có hợp đồng</h6>
                                                    <p className="text-muted small mb-0">
                                                        Phòng này chưa có hợp đồng hoặc hợp đồng đã hết hạn.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </Tab>
                            <Tab eventKey="repairs" title={<span><FaWrench className="me-2" />Lịch sử sửa chữa</span>}>
                                {/* Lịch sử sửa chữa */}
                                <section className="mb-3">
                                    <h5>Lịch sử sửa chữa</h5>
                                    {roomDetails.roomRepairHostory ? (
                                        <div>
                                            {/* Hiển thị lịch sử sửa chữa tại đây */}
                                        </div>
                                    ) : (
                                        <p>Không có lịch sử sửa chữa.</p>
                                    )}
                                </section>
                            </Tab>
                        </Tabs>
                    </div>
                ) : (
                    <p>Không có dữ liệu để hiển thị.</p>
                )}
            </Modal.Body>
            <UpdateTenantModal
                show={showUpdateModal}
                tenantId={selectedTenantId}
                onHide={handleCloseUpdateSuccess}
                onSuccess={handleUpdateSuccess}
            />
        </Modal>
    );
};

export default RoomDetailsModal;
