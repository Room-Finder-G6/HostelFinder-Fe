'use client';
import React, { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";
import { FilteredPosts } from "@/models/filteredPosts";  // Assuming this is the correct type
import { FilterPostData } from "@/models/filterPostData";  // Assuming this is already defined
import Loading from "@/components/Loading";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import Image from "next/image";

// Hàm lấy userId từ token JWT
export const getUserIdFromToken = (): string | null => {
    if (typeof window === "undefined") {
        console.error("localStorage is not available on the server");
        return null;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token not found in localStorage");
        return null;
    }

    try {
        const decodedToken: { UserId: string } = jwtDecode(token);
        return decodedToken.UserId || null;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};

const FavoritesPage = () => {
    const [favoritePosts, setFavoritePosts] = useState<FilteredPosts[]>([]); // Initial state as an empty array
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null); // Lấy userId từ token
    const [filterData, setFilterData] = useState<FilterPostData>({ // Data filter
        province: "",
        district: "",
    });

    const membershipColors: Record<string, string> = {
        Đồng: "gray",
        Bạc: "#4DC1B5",
        Vàng: "#e1c009",
    };

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const userIdFromToken = getUserIdFromToken();
        if (userIdFromToken) {
            setUserId(userIdFromToken);
            fetchFavorites(userIdFromToken);
        } else {
            setIsLoading(false);  // Nếu không có userId, dừng trạng thái loading
        }
    }, []);

    const fetchFavorites = async (userId: string) => {
        try {
            setIsLoading(true);
            const response = await apiInstance.get(`wishlists/GetWishlistByUserId/${userId}`);
            console.log(response.data);  // Kiểm tra xem response có đúng không
            if (response.status === 200 && response.data?.data?.posts) {
                let filteredPosts = response.data.data.posts;
                
                // Filter các bài viết nếu có dữ liệu lọc từ filterData
                if (filterData.province) {
                    filteredPosts = filteredPosts.filter((post: FilteredPosts) => post.address?.province === filterData.province);
                }
                if (filterData.district) {
                    filteredPosts = filteredPosts.filter((post: FilteredPosts) => post.address?.district === filterData.district);
                }

                setFavoritePosts(filteredPosts); // Lấy dữ liệu từ 'posts' đã lọc
            } else {
                console.error("Không có bài viết yêu thích nào");
                setFavoritePosts([]); // Set lại mảng rỗng nếu không có bài viết
            }
        } catch (error) {
            console.error("Error fetching favorite posts:", error);
            setFavoritePosts([]); // Set lại mảng rỗng khi có lỗi
        } finally {
            setIsLoading(false);
        }
    };

    // Hiển thị danh sách bài viết yêu thích
    return (
        <div className="property-listing-six bg-pink-two pt-60 md-pt-80 pb-170 xl-pb-120 mt-150 xl-mt-120">
            <div className="container">
                <h4 className={"mb-20"}>Danh sách yêu thích của bạn</h4>

                {isLoading && <Loading />}

                {favoritePosts.length === 0 && !isLoading && (
                    <div className="no-posts-found">Bạn chưa thêm bài viết nào vào danh sách yêu thích.</div>
                )}

                {/* Kiểm tra xem favoritePosts có phải là mảng và có dữ liệu không */}
                {Array.isArray(favoritePosts) && favoritePosts.length > 0 ? (
                    favoritePosts.map((item: FilteredPosts) => (  
                        <div key={item.id} className="listing-card-seven border-20 p-20 mb-30 wow fadeInUp">
                            <div className="d-flex flex-wrap layout-one">
                                <div className={`img-gallery position-relative z-1 border-20 overflow-hidden`}>
                                    <div
                                        className={`tag border-20 `}
                                        style={{ backgroundColor: membershipColors[item.membershipTag] || "gray" }}
                                    >
                                        {item.membershipTag}
                                    </div>
                                    <Image
                                        src={item.firstImage}
                                        alt="Image"
                                        className="img-fluid w-100 h-100 rounded-3"
                                        width={300}
                                        height={300}
                                        style={{ objectFit: "cover", borderRadius: "15px" }}
                                    />
                                </div>
                                <div className="property-info">
                                    <Link href={`/post-details/${item.id}`} className="title tran3s mb-15">
                                        {item.title}
                                    </Link>
                                    <div className="address">
                                        <i className="bi bi-geo-alt"></i>&nbsp;
                                        {item.address?.province},&nbsp;{item.address?.district},&nbsp;{item.address?.commune}
                                    </div>

                                    <div className="mb-20 pt-20 pb-5 w-75">{item.description}</div>
                                    <div className="pl-footer d-flex flex-wrap align-items-center justify-content-between">
                                        <div className={"d-flex gap-5 align-items-center"}>
                                            

                                            <span className={"mt-10"}>
                                                <strong>{item.size}</strong> <span>m<sup>2</sup></span>
                                            </span>
                                            <span className={"mt-10"}>Ngày đăng: {formatDate(item.createdOn)}</span>
                                        </div>
                                        <Link href={`/post-details/${item.id}`} className="btn-four rounded-circle">
                                            <i className="bi bi-arrow-up-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-posts-found">Không có bài viết yêu thích nào.</div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
