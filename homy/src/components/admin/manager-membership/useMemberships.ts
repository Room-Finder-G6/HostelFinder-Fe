import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";
import { toast } from 'react-toastify'; // Import toast để hiển thị thông báo

interface Membership {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
}

const useMemberships = () => {
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const fetchMemberships = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/Membership/GetListMembership`, {
                params: {
                    pageNumber,
                    pageSize: 10,
                },
            });

            const data = response.data.data.map((membership: any) => ({
                id: membership.id,
                name: membership.name,
                description: membership.description,
                price: membership.price,
                duration: membership.duration,
            }));

            setMemberships(data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching memberships:", error);
            toast.error('Error fetching memberships');
        } finally {
            setLoading(false);
        }
    };

    const deleteMembership = async (membershipId: string) => {
        try {
            const response = await apiInstance.delete(`/Membership/DeleteMembership/${membershipId}`);
    
            // Log phản hồi từ backend
            console.log("API Response:", response.data);
    
            if (response.data.succeeded) {
                toast.success("Xóa membership thành công!"); // Thành công thì dùng toast.success
                window.location.reload();
            } else {
                const errorMessage = response.data.message;
                console.log("Backend error message:", errorMessage);
    
                // Xử lý các thông báo lỗi từ backend
                if (errorMessage && errorMessage.includes("Không tìm thấy membership")) {
                    toast.error("Không tìm thấy membership cần xóa.");
                } else if (errorMessage && errorMessage.includes("Đã xóa membership này")) {
                    toast.warning("Membership này đã được xóa trước đó.");
                } else if (errorMessage) {
                    toast.error(errorMessage || "Đã xảy ra lỗi khi xóa membership.");
                } else {
                    toast.error("Đã xảy ra lỗi không xác định.");
                }
            }
        } catch (error: any) {
            // Log chi tiết lỗi
            console.log("Error Response:", error.response);
    
            if (error.response) {
                const errorMessage = error.response.data?.message || "Có lỗi xảy ra khi xóa membership.";
                console.log("Error message from backend:", errorMessage); // Log thông báo lỗi từ backend
    
                // Hiển thị các thông báo dựa trên mã trạng thái từ backend
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
    
    const updateMembership = async (id: string, updatedData: any) => {
        try {
            const response = await apiInstance.put(`/Membership/EditMembership/${id}`, updatedData);
            
            if (response.data.Succeeded) {
                toast.success('Membership updated successfully!');
                console.log('Update response:', response.data.Message); // Log thông điệp từ BE
                toast.success(response.data.Message); // Hiển thị thông điệp từ BE
            } else {
                toast.error('Error updating membership');
                console.log('Update error response:', response.data.Message); // Log thông điệp lỗi từ BE
                toast.error(response.data.Message); // Hiển thị thông điệp lỗi từ BE
            }

            fetchMemberships(pageIndex); // Gọi lại API để cập nhật danh sách
        } catch (error) {
            console.error("Error updating membership:", error);
            toast.error('Error updating membership');
        }
    };

    useEffect(() => {
        fetchMemberships(pageIndex);
    }, [pageIndex]);

    return { memberships, loading, totalPages, pageIndex, setPageIndex, deleteMembership, updateMembership };
};

export default useMemberships;
