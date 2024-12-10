import { useEffect, useState, useCallback } from "react";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";

interface Post {
    id: string;
    title: string;
    description: string;
    bookingStatus: boolean;
    images: string | null;
    createdOn: string;
    addressStory: {
        province: string;
        district: string;
        commune: string;
        detailAddress: string;
    };
}

interface JwtPayload {
    UserId: string;
}

const useStorieByUser = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [userId, setUserId] = useState<string | null>(null);

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

    const fetchPostsByUser = async (pageNumber: number, sortOption: string) => {
        if (!userId) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const sortDirection = sortOption === "1" ? "desc" : "asc";  // Sắp xếp theo ngày tạo, "desc" cho mới nhất và "asc" cho cũ nhất

            const response = await apiInstance.get(`/Story/user/${userId}`, {
                params: {
                    pageNumber,
                    pageSize: 10,
                    sortBy: "createdAt",  // Đảm bảo API có hỗ trợ sắp xếp theo createdAt
                    sortDirection,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const postsWithImages = response.data.data.map((post: any) => ({
                ...post,
                image: post.image ? `${process.env.NEXT_PUBLIC_API_URL}/${post.image}` : "/default-image.png",
            }));

            setPosts(postsWithImages || []);
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
            fetchPostsByUser(pageIndex, "1"); // Default: sort by Newest
        }
    }, [userId, pageIndex]);

    return { posts, loading, totalPages, pageIndex, setPageIndex, fetchPostsByUser };
};

export default useStorieByUser;
