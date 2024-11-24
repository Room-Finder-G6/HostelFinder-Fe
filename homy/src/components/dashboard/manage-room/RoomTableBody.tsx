// components/RoomTableBody.tsx
import React, { useEffect, useState } from 'react';
import apiInstance from '@/utils/apiInstance';
import { Room } from './Room';
import Loading from "@/components/Loading";
import { FaInfoCircle, FaEdit, FaTrash, FaFileContract, FaFileInvoice, FaEllipsisV } from 'react-icons/fa';
import CreateContractModal from './CreateContractModal';
import RoomDetailsModal from './RoomDetailsModal';
import { TfiWrite } from "react-icons/tfi";
import { Dropdown } from 'react-bootstrap';

interface RoomTableBodyProps {
    selectedHostel: string;
    selectedFloor: string | null;
    refresh: number;
}

const RoomTableBody: React.FC<RoomTableBodyProps> = ({ selectedHostel, selectedFloor, refresh }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');
    const [isRoomDetailsModalOpen, setIsRoomDetailsModalOpen] = useState<boolean>(false);
    const [roomDetailsId, setRoomDetailsId] = useState<string>('');

    useEffect(() => {
        if (!selectedHostel) return;

        const fetchRooms = async () => {
            setLoading(true);
            try {
                let url = `/rooms/hostels/${selectedHostel}`;
                if (selectedFloor) {
                    url += `?floor=${selectedFloor}`;
                }
                const response = await apiInstance.get(url);
                if (response.data.succeeded) {
                    setRooms(response.data.data);
                } else {
                    setError('Không thể tải danh sách phòng');
                }
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra khi tải danh sách phòng');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [selectedHostel, selectedFloor, refresh]);

    const handleEdit = (roomId: string) => {
        // Logic to edit the room
    };

    const handleDelete = (roomId: string) => {
        // Logic to delete the room
    };

    const handleCreateContract = (roomId: string) => {
        setSelectedRoomId(roomId);
        setIsModalOpen(true);
    };

    const handleCreateInvoice = (roomId: string) => {
        // Logic to create an invoice for the room
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRoomId('');
    };

    const handleSuccessCreateContract = () => {
        setIsModalOpen(false);
        setSelectedRoomId('');
        // Làm mới danh sách phòng nếu cần
    };

    const handleViewRoomDetails = (roomId: string) => {
        setRoomDetailsId(roomId);
        setIsRoomDetailsModalOpen(true);
    };

    const handleCloseRoomDetailsModal = () => {
        setIsRoomDetailsModalOpen(false);
        setRoomDetailsId('');
    };

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

    if (error) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5} className="text-danger text-center py-3">
                        Lỗi: {error}
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
                        Không có phòng nào trong nhà trọ này.
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
                                <span className="badge bg-light text-success rounded-pill">
                                    Còn trống
                                </span>
                            ) : (
                                <span className="badge bg-light text-dark rounded-pill">
                                    Đã thuê
                                </span>
                            )}
                        </td>
                        <td className="py-3 px-4 text-end">
                            {/* Dropdown Menu */}
                            <Dropdown>
                                <Dropdown.Toggle variant="link" id={`dropdown-${room.id}`} className="btn-sm">
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
                                    <Dropdown.Item onClick={() => handleCreateInvoice(room.id)}>
                                        <TfiWrite className="me-2" />
                                        Ghi số dịch vụ
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>
                ))}
            </tbody>
            {/* Modal Tạo Hợp Đồng */}
            <CreateContractModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                roomId={selectedRoomId}
                hostelId={selectedHostel}
                onSuccess={handleSuccessCreateContract}
            />
            {/* Modal Thông Tin Phòng */}
            <RoomDetailsModal
                isOpen={isRoomDetailsModalOpen}
                onClose={handleCloseRoomDetailsModal}
                roomId={roomDetailsId}
            />
        </>
    );
};

export default RoomTableBody;
