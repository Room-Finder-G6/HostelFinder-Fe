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
    value: string | null;
}

const RoomSelect: React.FC<RoomSelectProps> = ({ hostelId, onChange, value }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch rooms based on the hostelId
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await apiInstance(`/rooms/select-room/${hostelId}`);
                const data = await response.data;

                if (data.succeeded && data.data) {
                    setRooms(data.data);
                } else {
                    setError('Failed to load rooms');
                }
            } catch (err) {
                setError('An error occurred while fetching rooms');
            } finally {
                setLoading(false);
            }
        };

        if (hostelId) {
            fetchRooms();
        }
    }, [hostelId]);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="form-group">
            <label htmlFor="roomId">Phòng</label>
            <select id="roomId" name="roomId" onChange={onChange}  className="form-control">
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                        {room.roomName}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default RoomSelect;
