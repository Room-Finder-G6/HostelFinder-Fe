import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";
import { AxiosError } from "axios";

interface Post {
    id: string;
    title: string;
    description: string; // Thêm trường description
    status: boolean;
    firstImage: string | null;
    createdOn: string;
    address: { // Thêm trường address
        province: string;
        district: string;
        commune: string;
        detailAddress: string;
    };
}

const useAllPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const fetchAllPosts = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/posts/GetAllPostWithPriceAndStatusAndTime`, {
                params: {
                    searchPhrase: "",
                    pageNumber: pageNumber,
                    pageSize: 10,
                    sortBy: "createdOn",
                    sortDirection: 0,
                },
            });
    
            setPosts(response.data.data || []); // response.data.data phải chứa description & address
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.error("Error fetching all posts:", axiosError.response.data);
            } else {
                console.error("Error fetching all posts:", axiosError.message);
            }
        } finally {
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        fetchAllPosts(pageIndex);
    }, [pageIndex]);

    return { posts, loading, totalPages, pageIndex, setPageIndex };
};

export default useAllPosts;
