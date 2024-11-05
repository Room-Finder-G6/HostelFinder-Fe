import React, { useState, useEffect, useCallback } from 'react';
import apiInstance from '@/utils/apiInstance';
import { jwtDecode } from "jwt-decode";

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

  // Hàm lấy landlordId từ token
  const getUserIdFromToken = useCallback(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        return decodedToken.UserId;
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Error decoding user token");
        return null;
      }
    }
    setError("No token found");
    return null;
  }, []);

  useEffect(() => {
    const fetchHostels = async () => {
      const landlordId = getUserIdFromToken();
      if (!landlordId) return;

      try {
        const response = await apiInstance.get(`/hostels/GetHostelsByLandlordId/${landlordId}`);
        if (response.data.succeeded) {
          setHostels(response.data.data);
        } else {
          console.error("Failed to load hostels");
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };
    fetchHostels();
  }, [getUserIdFromToken]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="d-flex align-items-center mb-4">
      <label htmlFor="hostelSelect" className="me-2">Nhà trọ:</label>
      <select
        id="hostelSelect"
        className="form-select"
        value={selectedHostel}
        onChange={onHostelChange}
      >
        <option value="">Chọn nhà trọ</option>
        {hostels.map((hostel) => (
          <option key={hostel.id} value={hostel.id}>
            {hostel.hostelName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HostelSelector;
