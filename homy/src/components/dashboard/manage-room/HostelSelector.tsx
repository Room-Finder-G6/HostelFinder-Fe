import React, { useState, useEffect, useCallback } from "react";
import apiInstance from "@/utils/apiInstance";
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
        const response = await apiInstance.get(
          `/hostels/GetHostelsByLandlordId/${landlordId}`
        );
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
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mb-2">
      {/* <label
        htmlFor="hostelSelect"
        className="block text-sm font-medium text-gray-700 mb-2 text-left"
      >
        Nhà trọ:
      </label> */}
      <select
        id="hostelSelect"
        className="block px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-left"
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
