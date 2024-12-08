'use client';
import React, {useEffect, useState} from "react";
import apiInstance from "@/utils/apiInstance";
import {FilteredPosts} from "@/models/filteredPosts"; // Assuming this is the correct type
import {FilterPostData} from "@/models/filterPostData";  // Assuming this is already defined
import Loading from "@/components/Loading";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";
import Image from "next/image";
import {toast} from 'react-toastify'; // Import react-toastify
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";

const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

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
    const [favoritePosts, setFavoritePosts] = useState<FilteredPosts[]>([]); // Changed type to FilteredPosts
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

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
            if (response.status === 200 && response.data?.data?.posts) {
                setFavoritePosts(response.data.data.posts);
            } else {
                setFavoritePosts([]);
            }
        } catch (error) {
            console.error("Error fetching favorite posts:", error);
            setFavoritePosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFromWishlist = async (wishlistPostId: string) => {
        try {
            console.log("Deleting post with wishlistPostId:", wishlistPostId);

            // Thực hiện xóa bài viết trong wishlist
            const response = await apiInstance.delete(
                `wishlists/DeleteRoomFromWishlist?id=${wishlistPostId}`
            );

            if (response.status === 200) {
                // Xử lý thành công, cập nhật lại danh sách bài viết yêu thích
                setFavoritePosts((prevPosts) =>
                    prevPosts.filter((post) => post.wishlistPostId !== wishlistPostId) // Lọc theo wishlistPostId
                );

                // Hiển thị thông báo toast thành công
                toast.success("Bài viết đã được xóa khỏi danh sách yêu thích!", {

                    autoClose: 3000,
                });
            } else {
                console.error("Không thể xóa bài viết khỏi danh sách yêu thích:");
            }
        } catch (error) {
            console.error("Error deleting post from wishlist:", error);
            toast.error("Đã có lỗi xảy ra khi xóa bài viết.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const membershipColors: Record<string, string> = {
        Đồng: "gray",
        Bạc: "#4DC1B5",
        Vàng: "#e1c009",
    };

    return (
        <div className="property-listing-six bg-pink-two pt-60 md-pt-80 pb-170 xl-pb-120 mt-150 xl-mt-120">
            <div className="container">
                <h4 className="mb-20">Danh sách yêu thích của bạn</h4>

                {isLoading && <Loading/>}

                {favoritePosts.length === 0 && !isLoading && (
                    <div className="no-posts-found">Bạn chưa thêm bài viết nào vào danh sách yêu thích.</div>
                )}

                {favoritePosts.map((item) => (
                    <div key={item.id} className="listing-card-seven border-20 p-20 mb-30 wow fadeInUp">
                        <div className="d-flex flex-wrap layout-one">
                            <div className={`img-gallery position-relative z-1 border-20 overflow-hidden`}>
                                {item.membershipTag && (
                                    <div
                                        className={`tag border-20 `}
                                        style={{backgroundColor: `${membershipColors[item.membershipTag]}`}}
                                    >
                                        Vip&nbsp;{item.membershipTag}
                                    </div>
                                )}
                                <Image
                                    src={item.firstImage || "/path/to/default-image.jpg"} // Đảm bảo src luôn có giá trị hợp lệ
                                    alt={item.title || "Default Image"} // Nếu không có title, dùng "Default Image"
                                    className="img-fluid w-100 h-100 rounded-3"
                                    width={300}
                                    height={300}
                                    style={{objectFit: "cover", borderRadius: "15px"}}
                                />
                            </div>
                            <div className="property-info">
                                <Link href={`/post-details/${item.id}`} className="title tran3s mb-15">
                                    {item.title}
                                </Link>
                                <div className="address">
                                    <i className="bi bi-geo-alt"></i>&nbsp;
                                    {item.address ? (
                                        `${item.address.province}, ${item.address.district}, ${item.address.commune}`
                                    ) : (
                                        <span>Thông tin địa chỉ không có sẵn</span>
                                    )}
                                </div>
                                <div className="mb-20 pt-20 pb-5 w-75">{truncateText(item.description, 160)}</div>
                                <div className="pl-footer d-flex flex-wrap align-items-center justify-content-between">
                                    <div className="d-flex gap-5 align-items-center">
                                        <strong
                                            className="price fw-500 me-auto"
                                            style={{color: "hsl(0,94%,42%)"}}
                                        >
                                            {item.monthlyRentCost !== undefined && item.monthlyRentCost !== null ? (
                                                item.monthlyRentCost.toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })
                                            ) : (
                                                "Chưa có giá thuê"
                                            )}
                                            {" "}
                                            đ
                                            {item.monthlyRentCost && <>/<sub>tháng</sub></>}
                                        </strong>

                                        <span className="mt-10">
                                        <strong>{item.size}</strong> <span>m<sup>2</sup></span>
                                    </span>
                                        <span className="mt-10">Ngày đăng: {formatDate(item.createdOn)}</span>
                                    </div>
                                    <button
                                        className="btn-four rounded-circle"
                                        onClick={() => deleteFromWishlist(item.wishlistPostId)}  // Sử dụng wishlistPostId
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
