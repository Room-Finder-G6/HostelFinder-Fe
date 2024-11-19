import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";

interface User {
    id: string;
    username: string;
    email: string;
    phone: string;
    avatarUrl: string;
    isActive: boolean;
}

const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const fetchUsers = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/users/GetListUser`, {
                params: {
                    pageNumber,
                    pageSize: 10,
                },
            });

            const data = response.data.data.map((user: any) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                avatarUrl: user.avatarUrl || "/default-avatar.png", // Default avatar if missing
                isActive: user.isActive,
            }));

            setUsers(data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(pageIndex);
    }, [pageIndex]);

    return { users, loading, totalPages, pageIndex, setPageIndex };
};

export default useUsers;
