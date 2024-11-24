"use client"; // Thêm dòng này

import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";

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
          discount: item.discount || 0, // Giảm giá (nếu có)
          duration: item.duration,
          membershipServices: item.membershipServices.map((service: any) => ({
            serviceName: service.serviceName,
            maxPostsAllowed: service.maxPostsAllowed,
            maxPushTopAllowed: service.maxPushTopAllowed,
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

  useEffect(() => {
    fetchMemberships();
  }, []);

  return { memberships, loading, error };
};

export default useMemberships;
