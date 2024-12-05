import React, { useEffect, useState } from "react";
import { Modal, Tabs, Tab, Table, Button, Form } from 'react-bootstrap';
import { FaClipboardList, FaFileInvoiceDollar, FaTimes, FaUser, FaWrench } from "react-icons/fa";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import DatePicker from 'react-datepicker';
interface RoomDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
}

interface RoomInfoDetail {
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
                return "Phòng đơn";
            case 2:
                return "Phòng đôi";
            case 3:
                return "Phòng gia đình";
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


    return (
        <Modal show={isOpen} onHide={onClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark fw-bold">Thông tin phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                                {/* Thông tin chung */}
                                <section className="mb-3">
                                    <h5>Thông tin chung</h5>
                                    <p><strong>Tên phòng:</strong> {roomDetails.roomInfoDetail.roomName}</p>
                                    <p><strong>Tầng:</strong> {roomDetails.roomInfoDetail.floor}</p>
                                    <p><strong>Số người tối đa:</strong> {roomDetails.roomInfoDetail.maxRenters}</p>
                                    <p><strong>Số khách hiện tại:</strong> {roomDetails.roomInfoDetail.numberOfCustomer}</p>
                                    <p><strong>Diện tích:</strong> {roomDetails.roomInfoDetail.size} m²</p>
                                    <p><strong>Trạng thái:</strong> {roomDetails.roomInfoDetail.isAvailable ? "Còn trống" : "Đã thuê"}</p>
                                    <p><strong>Giá thuê hàng tháng:</strong> {new Intl.NumberFormat('vi-VN').format(roomDetails.roomInfoDetail.monthlyRentCost)} đ</p>
                                    <p><strong>Loại phòng:</strong> {getRoomType(roomDetails.roomInfoDetail.roomType)}</p>
                                    {/* Hình ảnh phòng */}
                                    <div className="mb-3">
                                        <h5>Hình ảnh phòng</h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            {roomDetails.pictureRoom.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Hình ảnh phòng ${index + 1}`}
                                                    className="rounded"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </Tab>
                            <Tab eventKey="tenants" title={<span><FaUser className="me-2" />Khách thuê trọ</span>}>
                                {/* Khách thuê trọ */}
                                <section className="mb-3">
                                    <h5>Khách thuê trọ</h5>
                                    {roomDetails.infomationTenacy.length > 0 ? (
                                        <div className="list-group">
                                            {roomDetails.infomationTenacy.map((tenant, index) => (
                                                <div
                                                    key={index}
                                                    className={`list-group-item d-flex align-items-center ${index === 0 ? 'bg-white text-black' : ''}`}
                                                >
                                                    <img
                                                        src={tenant.avatarUrl}
                                                        alt={tenant.fullName}
                                                        className="rounded-circle me-3"
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                    />
                                                    <div>
                                                        <p><strong>Tên:</strong> {tenant.fullName}</p>
                                                        <p><strong>Email:</strong> {tenant.email}</p>
                                                        <p><strong>Điện thoại:</strong> {tenant.phone}</p>
                                                        <p><strong>Tỉnh/Thành phố:</strong> {tenant.province}</p>
                                                        <p><strong>Số CMND:</strong> {tenant.identityCardNumber}</p>
                                                        <p><strong>Ngày vào:</strong> {new Date(tenant.moveInDate).toLocaleDateString('vi-VN')}</p>
                                                        {tenant.description && <p><strong>Mô tả:</strong> {tenant.description}</p>}

                                                        {/* Dấu hiệu người đại diện hợp đồng và người liên hệ */}
                                                        {index === 0 && (
                                                            <div>
                                                                <span className="badge bg-success me-2">Người đại diện hợp đồng</span>
                                                                <span className="badge bg-info">Người liên hệ</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Không có khách thuê trọ.</p>
                                    )}
                                </section>

                            </Tab>
                            <Tab eventKey="invoices" title={<span><FaFileInvoiceDollar className="me-2" />Lịch sử hóa đơn</span>}>
                                {/* Lịch sử hóa đơn */}
                                <section className="mb-3">
                                    <h5>Lịch sử hóa đơn</h5>
                                    {roomDetails.invoiceDetailInRoom ? (
                                        <div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <strong>Thông tin hóa đơn</strong>
                                                </div>
                                                <div className="card-body">
                                                    <p>
                                                        <strong>Mã hóa đơn:</strong> {roomDetails.invoiceDetailInRoom.id}
                                                    </p>
                                                    <p>
                                                        <strong>Tháng/Năm:</strong> {roomDetails.invoiceDetailInRoom.billingMonth}/{roomDetails.invoiceDetailInRoom.billingYear}
                                                    </p>
                                                    <p>
                                                        <strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN').format(roomDetails.invoiceDetailInRoom.totalAmount)} đ
                                                    </p>
                                                    <p>
                                                        <strong>Trạng thái:</strong>
                                                        <span className={`badge ${roomDetails.invoiceDetailInRoom.isPaid ? "bg-success" : "bg-danger"} ms-2`}>
                                                            {roomDetails.invoiceDetailInRoom.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>


                                            {/* Chi tiết hóa đơn */}
                                            <div className="table-responsive">
                                                <Table striped bordered hover className="align-middle">
                                                    <caption className="caption-top">
                                                        <strong>Chi tiết dịch vụ hóa đơn</strong>
                                                    </caption>
                                                    <thead className="table-primary">
                                                        <tr>
                                                            <th>Dịch vụ</th>
                                                            <th className="text-center">Đơn giá</th>
                                                            <th className="text-center">Chi phí thực tế</th>
                                                            <th className="text-center">Số lượng khách</th>
                                                            <th className="text-center">Chỉ số trước</th>
                                                            <th className="text-center">Chỉ số hiện tại</th>
                                                            <th className="text-center">Ngày lập</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {roomDetails.invoiceDetailInRoom.invoiceDetails.map((detail, index) => (
                                                            <tr key={index}>
                                                                <td>{detail.serviceName}</td>
                                                                <td className="text-center">{new Intl.NumberFormat('vi-VN').format(detail.unitCost)} đ</td>
                                                                <td className="text-center">{new Intl.NumberFormat('vi-VN').format(detail.actualCost)} đ</td>
                                                                <td className="text-center">{detail.numberOfCustomer}</td>
                                                                <td className="text-center">{detail.previousReading === 0 ? 'N/A' : detail.previousReading}</td>
                                                                <td className="text-center">{detail.currentReading === 0 ? 'N/A' : detail.currentReading}</td>
                                                                <td className="text-center">{new Date(detail.billingDate).toLocaleDateString('vi-VN')}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>Không có lịch sử hóa đơn.</p>
                                    )}
                                </section>
                            </Tab>
                            <Tab eventKey="contracts" title={<span><FaClipboardList className="me-2" />Lịch sử hợp đồng</span>}>
                                {/* Lịch sử hợp đồng */}
                                <section className="mb-3">
                                    <h5>Lịch sử hợp đồng</h5>
                                    {roomDetails.contractDetailInRoom ? (
                                        <div>
                                            <p hidden><strong>Id:</strong> {roomDetails.contractDetailInRoom.id}</p>
                                            <p><strong>Ngày bắt đầu:</strong> {new Date(roomDetails.contractDetailInRoom.startDate).toLocaleDateString('vi-Vn')}</p>
                                            <p><strong>Ngày kết thúc:</strong> {roomDetails.contractDetailInRoom.endDate ? new Date(roomDetails.contractDetailInRoom.endDate).toLocaleDateString('vi-VN') : "N/A"}</p>
                                            <p><strong>Tiền thuê hàng tháng:</strong> {new Intl.NumberFormat('vi-VN').format(roomDetails.contractDetailInRoom.monthlyRent)} đ</p>
                                            <p><strong>Số tiền đặt cọc:</strong> {new Intl.NumberFormat('vi-VN').format(roomDetails.contractDetailInRoom.depositAmount)} đ</p>
                                            <p><strong>Chu kỳ thanh toán (ngày):</strong> {roomDetails.contractDetailInRoom.paymentCycleDays}</p>
                                            {roomDetails.contractDetailInRoom.contractTerms && (
                                                <p><strong>Điều khoản hợp đồng:</strong> {roomDetails.contractDetailInRoom.contractTerms}</p>
                                            )}
                                            {roomDetails?.contractDetailInRoom?.id && (
                                                <button
                                                    className="btn btn-danger me-2"
                                                    onClick={() => handleShowConfirmModal(roomDetails.contractDetailInRoom!.id!)}
                                                >
                                                    Kết thúc hợp đồng
                                                </button>
                                            )}


                                            {/* Button Gia hạn hợp đồng */}
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleExtendContract(roomDetails.contractDetailInRoom!.id!)}
                                                disabled={loading}
                                            >
                                                Gia hạn hợp đồng
                                            </button>

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
                                        <p>Không có lịch sử hợp đồng hoặc hợp đồng đã hết hạn.</p>
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
        </Modal>
    );
};

export default RoomDetailsModal;
