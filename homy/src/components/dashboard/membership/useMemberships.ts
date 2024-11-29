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
  const [ownedMemberships, setOwnedMemberships] = useState<string[]>([]); // Lưu danh sách các membership đã mua

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
        toast.error("Không thể lấy dữ liệu membership.");
      }
    } catch (err: any) {
      toast.error("Đã xảy ra lỗi khi kết nối với server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnedMemberships = async (userId: string) => {
    try {
      const response = await apiInstance.get(`/Membership/MembershipServices?userId=${userId}`);
      if (response.data && response.data.succeeded) {
        const memberships = response.data.data.map((item: any) => item.membershipId);
        setOwnedMemberships(memberships); // Lưu danh sách các gói đã mua
      } else {
        toast.error("Không thể lấy thông tin gói đã mua.");
      }
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi khi lấy thông tin gói đã mua.");
    }
  };

  // Mua membership
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
    if (ownedMemberships.includes(membershipId)) {
      toast.warning("Bạn đã mua gói này rồi! Muốn gia hạn thêm?");
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

      if (response.data.success) {
        toast.success("Mua membership thành công!");
      } else {
        toast.error(response.data.message || "Đã xảy ra lỗi khi mua membership.");
      }
    } catch (error: any) {
      // Kiểm tra lỗi cụ thể
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Bạn đang sử dụng gói thành viên này. Không thể mua thêm!");
        } else if (error.response.status === 500) {
          toast.error("Lỗi server. Vui lòng thử lại sau.");
        } else {
          toast.error("Có lỗi xảy ra khi mua membership.");
        }
      } else if (error.request) {
        toast.error("Không thể kết nối đến server.");
      } else {
        toast.error("Đã xảy ra lỗi.");
      }
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken(); // Lấy userId từ token
    if (userId) {
      fetchOwnedMemberships(userId); // Lấy danh sách các gói đã mua
    }
    fetchMemberships(); // Lấy danh sách gói có sẵn
  }, []);

  return { memberships, loading, error, buyMembership };
};

export default useMemberships;
