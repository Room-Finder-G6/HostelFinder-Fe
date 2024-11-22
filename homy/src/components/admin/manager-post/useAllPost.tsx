import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";
import { AxiosError } from "axios";
interface Post {
    id: string;
    title: string;
    status: boolean;
    image: string | null;
    createdOn: string;
}

const useAllPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);

    // Gọi API để lấy danh sách bài viết
    const fetchAllPosts = async (pageNumber: number) => {
        setLoading(true);

        try {
            const response = await apiInstance.post(`/posts/get-all`, {
                searchPhrase: "",
                pageNumber: pageNumber,
                pageSize: 10,
                sortBy: "createdOn",
                sortDirection: 0,
            });
        
            setPosts(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            const axiosError = error as AxiosError; // Ép kiểu
            if (axiosError.response) {
                console.error("Error fetching all posts:", axiosError.response.data);
            } else {
                console.error("Error fetching all posts:", axiosError.message);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAllPosts(pageIndex);
    }, [pageIndex]);

    return { posts, loading, totalPages, pageIndex, setPageIndex };
};

export default useAllPosts;
