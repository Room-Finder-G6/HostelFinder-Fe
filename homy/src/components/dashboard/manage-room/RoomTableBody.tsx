import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaEdit, FaEllipsisV, FaFileContract, FaFileInvoice, FaInfoCircle, FaTrash } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';

import apiInstance from '@/utils/apiInstance';
import Loading from '@/components/Loading';
import CreateContractModal from './popup-modal/CreateContractModal';
import RoomDetailsModal from './popup-modal/RoomDetailsModal';
import CreateInvoiceModal from './popup-modal/CreateInvoiceModal';
import MeterReadingForm from './popup-modal/MeterReadingModal';
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
}

const RoomTableBody: React.FC<RoomTableBodyProps> = ({ selectedHostel, selectedFloor, refresh }) => {
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
        console.log(`Edit Room ID: ${roomId}`);
    };

    const handleDelete = (roomId: string) => {
        console.log(`Delete Room ID: ${roomId}`);
    };

    const handleCreateContract = (roomId: string) => {
        setSelectedRoomId(roomId);
        setIsModalOpen(true);
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
                    <tr key={room.id} className="border-bottom">
                        <td className="py-3 px-4">
                            <div className="d-flex align-items-center">
                                <img
                                    src={room.imageRoom}
                                    alt={room.roomName}
                                    className="rounded me-3"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <div>
                                    <h6 className="fw-semibold fs-5">{room.roomName}</h6>
                                    <p className="text-muted small">Tầng: {room.floor ?? 'N/A'}</p>
                                    <p className="text-muted small">Diện tích: {room.size} m²</p>
                                    <p className="text-muted small">Số người tối đa: {room.maxRenters}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-3 px-4">{new Date(room.createdOn).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Intl.NumberFormat('vi-VN').format(room.monthlyRentCost)} đ</td>
                        <td className="py-3 px-4">
                            {room.isAvailable ? (
                                <span className="property-status Active">
                                    Còn trống
                                </span>
                            ) : (
                                <span className="property-status pending">
                                    Đã thuê
                                </span>
                            )}
                        </td>
                        <td className="py-3 px-4 text-end">
                            <Dropdown>
                                <Dropdown.Toggle id={`dropdown-${room.id}`} className="btn-sm btn-light">
                                    <FaEllipsisV />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleViewRoomDetails(room.id)}>
                                        <FaInfoCircle className="me-2" />
                                        Thông tin phòng
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleEdit(room.id)}>
                                        <FaEdit className="me-2" />
                                        Chỉnh sửa
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDelete(room.id)}>
                                        <FaTrash className="me-2" />
                                        Xóa
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => handleCreateContract(room.id)}>
                                        <FaFileContract className="me-2" />
                                        Tạo hợp đồng
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleCreateInvoice(room.id)}>
                                        <FaFileInvoice className="me-2" />
                                        Tạo hóa đơn
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleMeterReading(room.id)}>
                                        <TfiWrite className="me-2" />
                                        Ghi số dịch vụ
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
        </>
    );
};

export default RoomTableBody;
