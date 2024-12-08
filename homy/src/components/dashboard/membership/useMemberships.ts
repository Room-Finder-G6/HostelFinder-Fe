"use client"; // Dòng này cần có cho Next.js

import { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import { toast } from "react-toastify";

interface MembershipService {
  serviceName: string;
  maxPostsAllowed: number;
  maxPushTopAllowed: number;
}

interface MembershipData {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  duration: number;
  membershipServices: MembershipService[];
}

const useMemberships = () => {
  const [memberships, setMemberships] = useState<MembershipData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ownedMemberships, setOwnedMemberships] = useState<string[]>([]);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get("/Membership/GetListMembership");
      if (response.data && response.data.succeeded) {
        const transformedData = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          discount: item.discount || 0,
          duration: item.duration,
          membershipServices: item.membershipServices.map((service: any) => ({
            serviceName: service.serviceName,
            maxPostsAllowed: service.maxPostsAllowed || 0,
            maxPushTopAllowed: service.maxPushTopAllowed || 0,
          })),
        }));
        setMemberships(transformedData);
      } else {
        setError("Không thể lấy dữ liệu membership.");
        toast.error("Không thể lấy dữ liệu membership.");
      }
    } catch (err: any) {
      toast.error("Đã xảy ra lỗi khi kết nối với server.");
    } finally {
      setLoading(false);
    }
  };

  const buyMembership = async (membershipId: string) => {
    const userId = getUserIdFromToken();

    if (!userId) {
      toast.error("Vui lòng đăng nhập trước khi mua membership.");
      return;
    }

    if (!membershipId) {
      toast.error("Không có thông tin gói membership.");
      return;
    }

    try {
      console.log("User ID:", userId);
      console.log("Membership ID:", membershipId);

      const apiUrl = `/users/BuyMembership?userId=${userId}&membershipId=${membershipId}`;
      console.log("API URL:", apiUrl);

      const response = await apiInstance.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Log phản hồi từ backend
      console.log("API Response:", response.data);

      if (response.status === 200) {
        toast.success("Mua gói thành viên thành công!"); // Thành công thì dùng toast.success
      } else {
        const errorMessage = response.data.message;
        console.log("Backend error message:", errorMessage);
      
        if (errorMessage && errorMessage.includes("Số dư")) {
          toast.error("Số dư không đủ! Vui lòng nạp tiền thêm vào ví.");
        } else if (errorMessage && errorMessage.includes("Bạn đã sử dụng gói người dùng thử này và chưa hết hạn.")) {
          toast.warning("Bạn đã sử dụng gói người dùng thử này và chưa hết hạn.");
        } else if (errorMessage) {
          toast.error(errorMessage || "Đã xảy ra lỗi khi mua membership.");
        } else {
          toast.error("Đã xảy ra lỗi không xác định.");
        }
      }
      
    } catch (error: any) {
      // Log chi tiết lỗi
      console.log("Error Response:", error.response);

      if (error.response) {
        const errorMessage = error.response.data?.message || "Có lỗi xảy ra khi mua membership.";
        console.log("Error message from backend:", errorMessage); // Log thông báo lỗi từ backend
        if (error.response.status === 400) {
          toast.error(errorMessage); // Hiển thị thông báo lỗi từ backend
        } else if (error.response.status === 500) {
          toast.error("Lỗi server. Vui lòng thử lại sau.");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        toast.error("Không thể kết nối đến server.");
      } else {
        toast.error("Đã xảy ra lỗi.");
      }
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    fetchMemberships();
  }, []);

  return { memberships, loading, error, buyMembership };
};

export default useMemberships;
