import apiInstance from '@/utils/apiInstance';
import React, { useEffect, useState } from 'react';
import Loading from "@/components/Loading";

interface Room {
    id: string;
    roomName: string;
}

interface RoomSelectProps {
    hostelId: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string | null; // Giá trị ban đầu
}

const RoomSelect: React.FC<RoomSelectProps> = ({ hostelId, onChange, value }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch rooms based on the hostelId
    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError(null); // Reset error state before fetching
            try {
                const response = await apiInstance.get(`/rooms/select-room/${hostelId}`);
                const data = response.data;

                if (data.succeeded && data.data) {
                    setRooms(data.data);
                } else {
                    setError('Không thể tải danh sách phòng.');
                }
            } catch (err) {
                setError('Có lỗi xảy ra khi lấy danh sách phòng.');
            } finally {
                setLoading(false);
            }
        };

        if (hostelId) {
            fetchRooms();
        }
    }, [hostelId]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="form-group">
            <label htmlFor="roomId">Phòng</label>
            <select
                id="roomId"
                name="roomId"
                onChange={onChange}
                value={value || ''} // Hiển thị giá trị ban đầu
                className="form-control"
            >
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                        {room.roomName}
                    </option>
                ))}
            </select>
            {error && <div className="text-danger">{error}</div>} {/* Hiển thị thông báo lỗi */}
        </div>
    );
};

export default RoomSelect;