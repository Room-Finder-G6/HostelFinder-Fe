import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";

// Định nghĩa kiểu `Post`
export interface Post {
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    images: File[];
    dateAvailable: string;
    membershipServiceId: string;
    imageUrls?: string[];
}



const usePost = (): {
    posts: Post[];
    totalPages: number;
    pageIndex: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
} => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPost = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await apiInstance.post(
                "/posts/get-all",
                {
                    pageNumber,
                    pageSize: 10,
                    sortDirection: 0,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setPosts(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost(pageIndex);
    }, [pageIndex]);

    return { posts, totalPages, pageIndex, setPageIndex, loading };
};

export default usePost;
