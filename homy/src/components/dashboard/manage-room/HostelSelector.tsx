import React, { useState, useEffect, useCallback } from "react";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode"; // Sửa lại import
import Loading from "@/components/Loading";
import { toast } from "react-toastify"; // Thêm import cho toast

interface Hostel {
  id: string;
  hostelName: string;
}

interface HostelSelectorProps {
  selectedHostel: string;
  onHostelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface JwtPayload {
  UserId: string;
}

const HostelSelector: React.FC<HostelSelectorProps> = ({ selectedHostel, onHostelChange }) => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm lấy landlordId từ token
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
      }
      finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, [getUserIdFromToken]);

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
      )}
    </div>
  );
};

export default HostelSelector;
