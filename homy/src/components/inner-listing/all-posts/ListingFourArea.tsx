'use client';
import React, { useEffect, useState } from "react";
import DropdownTwo from "@/components/search-dropdown/inner-dropdown/DropdownTwo";
import apiInstance from "@/utils/apiInstance";
import { FilterPostData } from "@/models/filterPostData";
import Loading from "@/components/Loading";
import Link from "next/link";
import Image from "next/image";
import { FilteredPosts } from "@/models/filteredPosts";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const ListingFourArea = () => {
    const [filteredPosts, setFilteredPosts] = useState<FilteredPosts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterData, setFilterData] = useState<FilterPostData>({
        province: "",
        district: "",
    });

    const [userId, setUserId] = useState<string | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

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

    // Hàm xử lý thêm bài viết vào danh sách yêu thích
    const handleAddToWishlist = async (postId: string) => {
        const userIdFromToken = getUserIdFromToken();

        if (!userIdFromToken) {
            toast.error("Bạn cần đăng nhập trước khi thêm bài viết vào danh sách yêu thích.");
            return;
        }

        try {
            // Check if the post is already in the wishlist
            if (likedPosts.has(postId)) {
                // Fetch wishlist to get the wishlistPostId
                const wishlistResponse = await apiInstance.get(`wishlists/GetWishlistByUserId/${userIdFromToken}`);
                const wishlistPosts = wishlistResponse.data.posts;

                // Find the wishlistPostId that corresponds to the postId
                const postToRemove = wishlistPosts.find((item: any) => item.roomId === postId);
                if (postToRemove) {
                    const wishlistPostId = postToRemove.id; // The id you want to remove
                    const response = await apiInstance.post("wishlists/DeleteRoomFromWishList", {
                        wishlistPostId: wishlistPostId,
                        userId: userIdFromToken,
                    });

                    if (response.status === 200) {
                        toast.info("Bạn đã bỏ yêu thích bài viết.");
                        setLikedPosts((prev) => {
                            const newLikedPosts = new Set(prev);
                            newLikedPosts.delete(postId);
                            localStorage.setItem('likedPosts', JSON.stringify([...newLikedPosts]));
                            return newLikedPosts;
                        });
                    } else {
                        toast.error("Lỗi khi bỏ bài viết khỏi danh sách yêu thích.");
                    }
                } else {
                    toast.error("Không tìm thấy bài viết trong danh sách yêu thích.");
                }
            } else {
                // Add to wishlist
                const response = await apiInstance.post("wishlists/AddRoomToWishList", {
                    postId: postId,
                    userId: userIdFromToken,
                });

                if (response.status === 200) {
                    const wishlistPostId = response.data.wishlistPostId; // Assuming the API returns the wishlistPostId
                    toast.success("Bài viết đã được thêm vào danh sách yêu thích!");
                    setLikedPosts((prev) => {
                        const newLikedPosts = new Set(prev).add(postId);
                        localStorage.setItem('likedPosts', JSON.stringify([...newLikedPosts]));
                        return newLikedPosts;
                    });
                } else {
                    toast.error("Thêm bài viết vào danh sách yêu thích thất bại.");
                }
            }
        } catch (error) {
            console.error("Lỗi khi thao tác với danh sách yêu thích:", error);
            toast.error("Lỗi khi thao tác với danh sách yêu thích.");
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.entries(filterData).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await apiInstance.post("posts/filter", formData, config);

            if (response.status === 200) {
                if (response.data.status === 'notFound') {
                    setFilteredPosts([]);
                } else {
                    setFilteredPosts(response.data.data || []);
                }
                console.log("Filtered posts:", response.data);
            } else {
                console.error("Failed to filter posts");
                setFilteredPosts([]);
            }
        } catch (error) {
            console.error("Error fetching filtered posts:", error);
            setFilteredPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Khi trang được load lại, kiểm tra danh sách yêu thích đã được lưu trong localStorage
        const savedLikedPosts = localStorage.getItem('likedPosts');
        if (savedLikedPosts) {
            setLikedPosts(new Set(JSON.parse(savedLikedPosts)));
        }
        handleSearch();
    }, []);

    const handleFilterChange = (newFilterData: FilterPostData) => {
        setFilterData(newFilterData);
    };

    return (
        <div className="property-listing-six bg-pink-two pt-60 md-pt-80 pb-170 xl-pb-120 mt-150 xl-mt-120">
            <div className="container">
                <h4 className={"mb-20"}>Cho thuê nhà trọ, phòng trọ trên toàn quốc</h4>
                <div className="search-wrapper-one layout-one bg position-relative mb-55 md-mb-40">
                    <div className="bg-wrapper border-layout">
                        <DropdownTwo
                            filterData={filterData as FilterPostData}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>

                {isLoading && <Loading />}

                {filteredPosts.length === 0 && !isLoading && (
                    <div className="no-posts-found">Không tìm thấy bài viết nào</div>
                )}

                {filteredPosts.map((item: any) => (
                    <div key={item.id} className="listing-card-seven border-20 p-20 mb-30 wow fadeInUp">
                        <div className="d-flex flex-wrap layout-one">
                            <div className={`img-gallery position-relative z-1 border-20 overflow-hidden`}>
                                <div
                                    className={`tag border-20 `}
                                    style={{ backgroundColor: `${membershipColors[item.membershipTag]}` }}
                                >
                                    Vip&nbsp;{item.membershipTag}
                                </div>
                                <Image
                                    src={item.firstImage}
                                    alt=""
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
                                    {item.address.province},&nbsp;{item.address.district},&nbsp;{item.address.commune}
                                </div>
                                <div className="mb-20 pt-20 pb-5 w-75">{truncateText(item.description, 160)}</div>
                                <div className="pl-footer d-flex flex-wrap align-items-center justify-content-between">
                                    <div className={"d-flex gap-5 align-items-center"}>
                                        <strong
                                            className="price fw-500 me-auto"
                                            style={{ color: "hsl(0,94%,42%)" }}
                                        >
                                            {item.monthlyRentCost.toLocaleString({
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}{" "}
                                            đ
                                            {item.monthlyRentCost && <>/<sub>tháng</sub></>}
                                        </strong>
                                        <span className={"mt-10"}>
                                            <strong>{item.size}</strong> <span>m<sup>2</sup></span>
                                        </span>
                                        <span className={"mt-10"}>Ngày đăng: {formatDate(item.createdOn)}</span>
                                    </div>
                                    <div className="style-none d-flex action-icons on-top">
                                        <button
                                            className={`wishlist-btn ${likedPosts.has(item.id) ? 'text-danger' : ''}`}
                                            onClick={() => handleAddToWishlist(item.id)}
                                        >
                                            <i className={`fa-heart ${likedPosts.has(item.id) ? 'fa-solid' : 'fa-light'}`} />
                                        </button>
                                    </div>
                                    <Link href={`/post-details/${item.id}`} className="btn-four rounded-circle">
                                        <i className="bi bi-arrow-up-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListingFourArea;
