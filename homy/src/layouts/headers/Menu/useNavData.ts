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

  // Khai báo intervalId ở phạm vi bên ngoài useEffect để có thể sử dụng trong cleanup
  let intervalId: NodeJS.Timeout | null = null;

  // Hàm lấy userId từ token JWT
  const getUserIdFromToken = (): string | null => {
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
  const updateWishlistCount = async (userId: string) => {
    const token = window.localStorage.getItem('token');
    if (userId && token) {
      try {
        const response = await apiInstance.get(`/wishlists/count/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.count !== undefined) {
          setWishlistCount(response.data.count); // Cập nhật số lượng wishlist
        } else {
          console.error("Invalid response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
      }
    }
  };

  // Cập nhật wishlist count khi component mount
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      intervalId = setInterval(() => {
        updateWishlistCount(userId); // Cập nhật wishlist count mỗi giây
      }, 800);

      // Dừng interval sau 5 giây
      setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId); // Dừng interval
        }
      }, 10000); 
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId); 
      }
    };
  }, []); 

  return { wishlistCount, role, error };
};

export default useNavData;
