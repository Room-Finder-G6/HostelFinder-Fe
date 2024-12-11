// hooks/useNavData.ts
import { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";

// Khai báo interface cho JWT Payload
interface JwtPayload {
  UserId: string;
  Role: string;
}

const useNavData = () => {
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy userId từ token JWT
  const getUserIdFromToken = () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        setRole(decodedToken.Role);
        return decodedToken.UserId;
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Error decoding user token");
        return null;
      }
    }
    setError("No token found");
    return null;
  };

  // Hàm lấy số lượng wishlist
  const updateWishlistCount = async () => {
    const token = window.localStorage.getItem('token');
    const userId = getUserIdFromToken(); 

    if (userId && token) {
      try {
        const response = await apiInstance.get(`/wishlists/count/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.count !== undefined) {
          setWishlistCount(response.data.count); // Cập nhật số lượng
        } else {
          console.error("Invalid response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching wishlist count:", error);

      }
    }
  };

  // useEffect(() => {
  //   updateWishlistCount(); // Cập nhật số lượng khi component mount
  // }, []);

  // Hàm xử lý xóa khỏi wishlist


  return { wishlistCount, role };
};

export default useNavData;