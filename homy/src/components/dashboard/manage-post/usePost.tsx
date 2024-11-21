import { useEffect, useState, useCallback } from "react";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";

interface Post {
    id: string;
    title: string;
    status: boolean;
    image: string | null;
    createdOn: string;
}

interface JwtPayload {
    UserId: string;
}

const usePostsByUser = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [userId, setUserId] = useState<string | null>(null);

    // Hàm lấy `userId` từ token
    const getUserIdFromToken = useCallback(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
                return decodedToken.UserId;
            } catch (error) {
                console.error("Error decoding token:", error);
                return null;
            }
        }
        console.error("No token found");
        return null;
    }, []);

    // Gọi API để lấy danh sách bài đăng của người dùng
    const fetchPostsByUser = async (pageNumber: number) => {
        if (!userId) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await apiInstance.get(`/posts/user/${userId}`, {
                params: {
                    pageNumber: pageNumber,
                    pageSize: 10,
                    sortDirection: 0,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = getUserIdFromToken();
        if (id) {
            setUserId(id);
        }
    }, [getUserIdFromToken]);

    useEffect(() => {
        if (userId) {
            fetchPostsByUser(pageIndex);
        }
    }, [userId, pageIndex]);

    return { posts, loading, totalPages, pageIndex, setPageIndex };
};

export default usePostsByUser;