import React, { useState, useEffect, useCallback } from "react";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import Loading from "@/components/Loading";
import { toast } from "react-toastify"; // Thêm import cho toast

interface Hostel {
  id: string;
  hostelName: string;
}

interface Room {
  id: string;
  roomName: string;
}

interface HostelSelectorProps {
  selectedHostel: string;
  selectedRoom: string;
  onHostelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onRoomChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface JwtPayload {
  UserId: string;
}

const RoomSelector: React.FC<HostelSelectorProps> = ({
  selectedHostel,
  selectedRoom,
  onHostelChange,
  onRoomChange,
}) => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]); // Đảm bảo rooms luôn là mảng
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getUserIdFromToken = useCallback((): string | null => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        return decodedToken.UserId;
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Lỗi khi giải mã token người dùng");
        return null;
      }
    }
    setError("Không tìm thấy token");
    return null;
  }, []);

  useEffect(() => {
    const fetchHostels = async () => {
      const landlordId = getUserIdFromToken();
      if (!landlordId) return;
      setLoading(true);
      try {
        const response = await apiInstance.get(
          `/hostels/GetHostelsByLandlordId/${landlordId}`
        );
        if (response.data.succeeded) {
          setHostels(response.data.data);
        } else {
          console.error("Failed to load hostels");
          toast.error("Không thể tải danh sách nhà trọ.", { position: "top-center" });
        }
      } catch (error: any) {
        console.error("Error fetching hostels:", error);
        toast.error("Đã xảy ra lỗi khi tải danh sách nhà trọ.", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, [getUserIdFromToken]);

  useEffect(() => {
    if (selectedHostel) {
      const fetchRooms = async () => {
        setLoading(true);
        try {
          const response = await apiInstance.get(`/rooms/hostels/${selectedHostel}`);
          if (response.data.succeeded) {
            setRooms(response.data.data);
          } else {
            toast.error("Không thể tải danh sách phòng.", { position: "top-center" });
          }
        } catch (error: any) {
          console.error("Error fetching rooms:", error);
          toast.error("Đã xảy ra lỗi khi tải danh sách phòng.", { position: "top-center" });
        } finally {
          setLoading(false);
        }
      };
      fetchRooms();
    } else {
      setRooms([]); // Đảm bảo là mảng trống khi không có hostel được chọn
    }
  }, [selectedHostel]);

  useEffect(() => {
    if (hostels.length > 0 && !selectedHostel) {
      onHostelChange({ target: { value: hostels[0].id } } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [hostels, selectedHostel, onHostelChange]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mb-2">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>
          <select
            id="hostelSelect"
            className="form-select"
            value={selectedHostel}
            onChange={onHostelChange}
            style={{ minWidth: "160px", maxHeight: "40px" }}
            disabled={hostels.length === 0}
          >
            <option value="0">Chọn nhà trọ</option>
            {hostels.map((hostel) => (
              <option key={hostel.id} value={hostel.id}>
                {hostel.hostelName}
              </option>
            ))}
          </select>

          {/* {selectedHostel && rooms && rooms.length > 0 && (
            <select
              id="roomSelect"
              className="form-select mt-2"
              value={selectedRoom}
              onChange={onRoomChange}
              style={{ minWidth: "160px", maxHeight: "40px" }}
              disabled={rooms.length === 0}
            >
              <option value="0">Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomName}
                </option>
              ))}
            </select>
          )} */}

          {/* Thông báo nếu không có phòng */}
          {selectedHostel && rooms.length === 0 && (
            <p>Không có phòng trong nhà trọ này.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RoomSelector;
