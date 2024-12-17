// hooks/useNavData.ts
import { useState, useEffect, useCallback } from "react";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  UserId: string;
  Role: string;
}

const useNavData = () => {
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getUserIdFromToken = useCallback(() => {
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
  }, []);

  const updateWishlistCount = useCallback(async () => {
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
          setWishlistCount(response.data.count); // Update count
        } else {
          console.error("Invalid response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
        setError("Failed to fetch wishlist count");
      }
    }
  }, [getUserIdFromToken]);

  useEffect(() => {
    updateWishlistCount(); // Update on mount and when token changes
  }, [updateWishlistCount]);

  return { wishlistCount, role, error };
};

export default useNavData;
