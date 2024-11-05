// components/dashboard/RoomTableBody.tsx
import React, { useEffect, useState } from 'react';
import apiInstance from '@/utils/apiInstance';
import { Room } from './Room';

interface RoomTableBodyProps {
    selectedHostel: string;
}

const RoomTableBody: React.FC<RoomTableBodyProps> = ({ selectedHostel }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedHostel) return;

        const fetchRooms = async () => {
            setLoading(true);
            try {
                const response = await apiInstance.get(`/rooms/hostels/${selectedHostel}`);
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
    }, [selectedHostel]);

    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5}>Đang tải dữ liệu...</td>
                </tr>
            </tbody>
        );
    }

    if (error) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5}>Lỗi: {error}</td>
                </tr>
            </tbody>
        );
    }

    if (rooms.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={5}>Không có phòng nào trong nhà trọ này.</td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody>
            {rooms.map((room) => (
                <tr key={room.id}>
                    <td>
                        <div className="property-info d-flex align-items-center">
                            <img
                                src={room.imageRoom}
                                alt={room.roomName}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
                            />
                            <div>
                                <h6 className="mb-1">{room.roomName}</h6>
                                <p className="mb-0">Nhà trọ: {room.hostelName}</p>
                                <p className="mb-0">Tầng: {room.floor ?? 'N/A'}</p>
                                <p className="mb-0">Diện tích: {room.size} m²</p>
                            </div>
                        </div>
                    </td>
                    <td>{new Date(room.createdOn).toLocaleDateString()}</td>
                    <td>{new Intl.NumberFormat('vi-VN').format(room.monthlyRentCost)}VNĐ</td>
                    <td>
                        {room.status ? (
                            <span className="badge bg-success">Còn trống</span>
                        ) : (
                            <span className="badge bg-secondary">Hết phòng</span>
                        )}
                    </td>
                    <td>
                        {/* Các hành động như chỉnh sửa, xóa */}
                        <button className="btn btn-primary btn-sm me-2">Chỉnh sửa</button>
                        <button className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default RoomTableBody;
