"use client";
import React, { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";
import { FilterPostData } from "@/models/filterPostData";
import Loading from "@/components/Loading";
import { FilteredPosts } from "@/models/filteredPosts";
import DropdownTwo from "@/components/search-dropdown/inner-dropdown/DropdownTwo";
import Link from "next/link";
import Image from "next/image";

const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

const ListingFourArea = () => {
    const [filteredPosts, setFilteredPosts] = useState<FilteredPosts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterData, setFilterData] = useState<FilterPostData>({
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

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(8); // Set the page size you want (e.g., 10 posts per page)
    const [totalPosts, setTotalPosts] = useState(0); // To track total number of posts for pagination

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            // Create FormData object
            const formData = new FormData();

            // Append all filterData properties to formData
            Object.entries(filterData).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            const response = await apiInstance.post(
                "posts/filtered-paged",
                formData,
                {
                    params: { pageIndex, pageSize },
                }
            );

            if (response.status === 200) {
                const { data, totalPosts } = response.data;
                setFilteredPosts(data);
                setTotalPosts(totalPosts);
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
        handleSearch();
    }, [pageIndex]); // Re-fetch posts when pageIndex or filterData changes

    const totalPages = Math.ceil(totalPosts / pageSize); // Calculate total pages

    return (
        <div className="property-listing-six bg-pink-two pt-60 md-pt-80 pb-170 xl-pb-120 mt-150 xl-mt-120">
            <div className="container">
                {/* Filter Section */}
                <div className="search-wrapper-one layout-one bg position-relative mb-55 md-mb-40">
                    <div className="bg-wrapper border-layout">
                        <DropdownTwo
                            filterData={filterData}
                            onFilterChange={setFilterData}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>

                {isLoading && <Loading />}

                {filteredPosts.length === 0 && !isLoading && (
                    <div className="no-posts-found">Không tìm thấy bài viết nào</div>
                )}

                {filteredPosts.map((item:any) => (
                    <div key={item.id} className="listing-card-seven border-20 p-20 mb-30">
                        <div className="d-flex flex-wrap layout-one">
                            <div className={`img-gallery position-relative z-1 border-20 overflow-hidden`}>
                                <div
                                    className={`tag border-20 `}
                                    style={{backgroundColor: `${membershipColors[item.membershipTag]}`}}
                                >
                                    Vip&nbsp;{item.membershipTag}
                                </div>
                                <img
                                    src={item.firstImage}
                                    alt=""
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
                                    {item.address.province},&nbsp;{item.address.district},&nbsp;{item.address.commune}
                                </div>
                                <div className="mb-20 pt-20 pb-5 w-75">{truncateText(item.description, 160)}</div>
                                <div className="pl-footer d-flex flex-wrap align-items-center justify-content-between">
                                    <div className={"d-flex gap-5 align-items-center"}>
                                        <strong
                                            className="price fw-500 me-auto"
                                            style={{color: "hsl(0,94%,42%)"}}
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
                                        <Link href="#">
                                            <i className="fa-light fa-heart"></i>
                                        </Link>
                                    </div>
                                    <Link href={`/post-details/${item.id}`} className="btn-four rounded-circle">
                                        <i className="bi bi-arrow-up-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Pagination Controls */}
                <nav aria-label="Page navigation" className={'d-flex justify-content-center'}>
                    <ul className="pagination">
                        <li className={`page-item ${pageIndex === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setPageIndex(pageIndex - 1)}
                                disabled={pageIndex === 1}
                            >
                                &laquo;
                            </button>
                        </li>

                        <li className="page-item">
                            <span className="page-link">
                                Trang {pageIndex}
                            </span>
                        </li>

                        <li className={`page-item ${pageIndex === totalPages ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setPageIndex(pageIndex + 1)}
                                disabled={filteredPosts.length === 0 || pageIndex === totalPages}
                            >
                                &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};


export default ListingFourArea;
