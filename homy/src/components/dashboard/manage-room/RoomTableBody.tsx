import React, { useEffect, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import { FaEdit, FaEllipsisV, FaFileContract, FaFileInvoice, FaInfoCircle, FaTrash } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';
import { toast } from "react-toastify";
import apiInstance from '@/utils/apiInstance';
import Loading from '@/components/Loading';
import CreateContractModal from './popup-modal/CreateContractModal';
import RoomDetailsModal from './popup-modal/RoomDetailsModal';
import CreateInvoiceModal from './popup-modal/CreateInvoiceModal';
import MeterReadingForm from './popup-modal/MeterReadingModal';
import EditRoomModal from './popup-modal/EditRoomModal';
import "./popup-modal/css/RoomDetailsModal.css"
import DeleteModal from "@/modals/DeleteModal";

interface Room {
    id: string;
    roomName: string;
    floor?: string;
    size: number;
    maxRenters: number;
    monthlyRentCost: number;
    isAvailable: boolean;
    createdOn: string;
    imageRoom: string;
}

interface RoomTableBodyProps {
    selectedHostel: string;
    selectedFloor: string | null;
    refresh: number;
    setRefreshRooms: React.Dispatch<React.SetStateAction<number>>;
}

const RoomTableBody: React.FC<RoomTableBodyProps> = ({ selectedHostel, selectedFloor, refresh, setRefreshRooms }) => {
    // State hooks
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');
    const [isRoomDetailsModalOpen, setIsRoomDetailsModalOpen] = useState<boolean>(false);
    const [roomDetailsId, setRoomDetailsId] = useState<string>('');
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
    const [invoiceRoomId, setInvoiceRoomId] = useState<string>('');
    const [isMeterReadingModalOpen, setIsMeterReadingModalOpen] = useState<boolean>(false);
    const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    // Fetch rooms when selectedHostel, selectedFloor, or refresh changes
    useEffect(() => {
        if (!selectedHostel) return;

        const fetchRooms = async () => {
            setLoading(true);
            try {
                let url = `/rooms/hostels/${selectedHostel}`;
                console.log(selectedHostel)
                if (selectedHostel === "") {
                    setRooms([]);
                }
                if (selectedFloor) {
                    url += `?floor=${selectedFloor}`;
                }
                const response = await apiInstance.get(url);
                if (response.data.succeeded) {
                    setRooms(response.data.data || []);
                } else {
                    setError('Không thể tải danh sách phòng');
                }
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra khi tải danh sách phòng');
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [selectedHostel, selectedFloor, refresh]);

    // Handler functions
    const handleEdit = (roomId: string) => {
        setSelectedRoomId(roomId);
        setIsEditRoomModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedRoomId) return
        try {
            const response = await apiInstance.delete(`/rooms/${selectedRoomId}`)
            if (response.data.succeeded) {
                toast.success("Xóa phòng thành công")
                setRefreshRooms(prev => prev + 1)
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setShowDeleteModal(false)
        }
    };

    const handleDeleteClick = (roomId: string) => {
        setSelectedRoomId(roomId)
        setShowDeleteModal(true)
    }

    const handleCreateContract = async (roomId: string) => {
        try {
            setLoading(true);
            const response = await apiInstance.get(`/rental-contracts/check-contract?roomId=${roomId}`);
            console.log(response.data);
            if (response.data) {
                if (response.data) {
                    toast.error("Phòng này đã có hợp đồng. Không thể tạo thêm hợp đồng mới.");
                }
            } else {
                setSelectedRoomId(roomId);
                setIsModalOpen(true);
            }
        } catch (error: any) {
            // Xử lý lỗi khi gọi API
            console.error("Error checking contract existence:", error);
            toast.error("Có lỗi xảy ra khi kiểm tra hợp đồng của phòng này.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = (roomId: string) => {
        setInvoiceRoomId(roomId);
        setIsInvoiceModalOpen(true);
    };

    const handleViewRoomDetails = (roomId: string) => {
        setRoomDetailsId(roomId);
        setIsRoomDetailsModalOpen(true);
    };

    const handleMeterReading = (roomId: string) => {
        setSelectedRoomId(roomId);
        setIsMeterReadingModalOpen(true);
    }

    // Modal close handlers
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRoomId('');
    };

    const handleSuccessCreateContract = () => {
        setIsModalOpen(false);
        setRefreshRooms(prev => prev + 1);
        setSelectedRoomId('');
    };

    const handleCloseRoomDetailsModal = () => {
        setIsRoomDetailsModalOpen(false);
        setRoomDetailsId('');
    };
    const handleCloseMeterReadingModal = () => {
        setIsMeterReadingModalOpen(false);
        setSelectedRoomId('');
    };

    const handleSuccessInformationRoom = () => {
        setRefreshRooms(prev => prev + 1);
    };

    // Render loading, error, or rooms
    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5}>
                        <Loading />
                    </td>
                </tr>
            </tbody>
        );
    }


    if (rooms.length === 0) {
        return (
            <tbody>
                <tr>
                    <td
                        colSpan={5}
                        className="text-center py-5 text-muted fs-5 fw-semibold fst-italic bg-light"
                    >
                        Hiện tại chưa có phòng trọ nào
                    </td>
                </tr>
            </tbody>
        );
    }
    return (
        <>
            <tbody>
                {rooms.map((room) => (
                    <tr key={room.id} className="room-row">
                        <td>
                            <div className="room-info">
                                <div className="room-image">
                                    <img
                                        src={room.imageRoom}
                                        alt={room.roomName}
                                        className="room-thumbnail"
                                    />
                                </div>
                                <div className="room-details">
                                    <h6 className="room-name">{room.roomName}</h6>
                                    <div className="specs">
                                        <span className="spec-item">
                                            <i className="bi bi-building text-primary"></i>
                                            Tầng {room.floor ?? 'N/A'}
                                        </span>
                                        <span className="spec-item">
                                            <i className="bi bi-arrows-angle-expand text-success"></i>
                                            {room.size} m²
                                        </span>
                                        <span className="spec-item">
                                            <i className="bi bi-people text-info"></i>
                                            {room.maxRenters} người
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="date-info">
                                <div className="date">{formatDate(room.createdOn)}</div>
                            </div>
                        </td>
                        <td>
                            <div className="price-info">
                                <span className="price">
                                    {new Intl.NumberFormat('vi-VN').format(room.monthlyRentCost)} đ
                                </span>
                                <small className="text-muted">/tháng</small>
                            </div>
                        </td>
                        <td>
                            <span className={`status-badge ${room.isAvailable ? 'available' : 'occupied'}`}>
                                {room.isAvailable ? 'Còn trống' : 'Đã thuê'}
                            </span>
                        </td>
                        <td>
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="light" className="btn-icon">
                                    <FaEllipsisV />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="action-menu">
                                    <Dropdown.Item onClick={() => handleViewRoomDetails(room.id)}>
                                        <FaInfoCircle className="icon-primary" />
                                        <span>Thông tin phòng</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleEdit(room.id)}>
                                        <FaEdit className="icon-warning" />
                                        <span>Chỉnh sửa</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDeleteClick(room.id)}>
                                        <FaTrash className="icon-danger" />
                                        <span>Xóa</span>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => handleCreateContract(room.id)}>
                                        <FaFileContract className="icon-success" />
                                        <span>Tạo hợp đồng</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleCreateInvoice(room.id)}>
                                        <FaFileInvoice className="icon-info" />
                                        <span>Tạo hóa đơn</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleMeterReading(room.id)}>
                                        <TfiWrite className="icon-secondary" />
                                        <span>Ghi số dịch vụ</span>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>
                ))}
            </tbody>
            <CreateContractModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                roomId={selectedRoomId}
                hostelId={selectedHostel}
                onSuccess={handleSuccessCreateContract}
            />
            <RoomDetailsModal
                isOpen={isRoomDetailsModalOpen}
                onClose={handleCloseRoomDetailsModal}
                roomId={roomDetailsId}
                onSuccess={handleSuccessInformationRoom}
            />
            <CreateInvoiceModal
                isOpen={isInvoiceModalOpen}
                hostelId={selectedHostel}
                onClose={() => {
                    setIsInvoiceModalOpen(false);
                    setInvoiceRoomId('');
                }}
                roomId={invoiceRoomId}
            />
            <MeterReadingForm
                hostelId={selectedHostel}
                roomId={selectedRoomId}
                isOpen={isMeterReadingModalOpen}
                onClose={handleCloseMeterReadingModal}
            />
            <EditRoomModal
                roomId={selectedRoomId}
                isOpen={isEditRoomModalOpen}
                onClose={() => setIsEditRoomModalOpen(false)}
                onSuccess={(updatedRoom) => {
                    setRefreshRooms(prev => prev + 1);
                }}
            />

            <DeleteModal show={showDeleteModal} title={"Xác nhận xóa"} message={"Bạn có chắc chắn muốn xóa phòng này"}
                onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} />

        </>
    );
};

export default RoomTableBody;
