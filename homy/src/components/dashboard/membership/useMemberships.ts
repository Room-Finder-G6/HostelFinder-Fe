"use client"; // Dòng này cần có cho Next.js

import { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance"; // Giả sử apiInstance đã được cấu hình
import { getUserIdFromToken } from "@/utils/tokenUtils"; // Đoạn mã lấy userId từ token

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Thêm state cho thông báo thành công
  const [failureMessage, setFailureMessage] = useState<string | null>(null); // Thêm state cho thông báo thất bại

  // Fetch danh sách gói membership từ API
  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get("/Membership/GetListMembership"); // API lấy danh sách gói membership
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
      }
    } catch (err: any) {
      console.error("Error fetching memberships:", err);
      setError("Đã xảy ra lỗi khi kết nối với server.");
    } finally {
      setLoading(false);
    }
  };

  // Mua membership
  const buyMembership = async (membershipId: string) => {
    const userId = getUserIdFromToken(); // Lấy userId từ token

    if (!userId) {
      alert("Vui lòng đăng nhập trước khi mua membership.");
      return;
    }

    if (!membershipId) {
      alert("Không có thông tin gói membership.");
      return;
    }

    try {
      // Log giá trị của userId và membershipId trước khi gửi
      console.log("User ID:", userId);
      console.log("Membership ID:", membershipId);

      // Tạo URL với query string
      const apiUrl = `/users/BuyMembership?userId=${userId}&membershipId=${membershipId}`;
      console.log("API URL:", apiUrl);

      // Gửi request với đúng URL và headers
      const response = await apiInstance.post(
        apiUrl, // Đảm bảo URL đúng
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header
          },
        }
      );

      // Kiểm tra phản hồi từ API
      if (response.data.success) {
        setSuccessMessage("Mua membership thành công!");
        alert("Mua membership thành công!");
      } else {
        setFailureMessage(response.data.message || "Đã xảy ra lỗi khi mua membership.");
        alert(response.data.message || "Đã xảy ra lỗi khi mua membership.");
      }
    } catch (error: any) {
      console.error("Error buying membership:", error);
      setFailureMessage("Có lỗi xảy ra khi mua membership.");
      alert("Có lỗi xảy ra khi mua membership.");
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return { memberships, loading, error, buyMembership, successMessage, failureMessage };
};

export default useMemberships;
