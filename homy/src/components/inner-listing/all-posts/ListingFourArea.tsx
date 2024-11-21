"use client";
import React, {useEffect, useState} from "react";
import DropdownTwo from "@/components/search-dropdown/inner-dropdown/DropdownTwo";
import apiInstance from "@/utils/apiInstance";
import {FilterPostData} from "@/models/filterPostData";
import Loading from "@/components/Loading";
import Link from "next/link";
import Image from "next/image";
import {FilteredPosts} from "@/models/filteredPosts";

const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const ListingFourArea = () => {
    const [filteredPosts, setFilteredPosts] = useState<FilteredPosts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterData, setFilterData] = useState<FilterPostData>({
        province: "",
        district: "",
        commune: "",
        minSize: 0,
        maxSize: 999,
        minPrice: 0,
        maxPrice: 9999999
    });

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await apiInstance.post("posts/filter", filterData);
            setIsLoading(true);
            if (response.status === 100) {
                setFilteredPosts(response.data.data);
                console.log("Filtered posts:", response.data.data);
            } else {
                console.error("Failed to filter posts");
            }
        } catch (error) {
            console.error("Error fetching filtered posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const handleFilterChange = (newFilterData: FilterPostData) => {
        setFilterData(newFilterData);
    };

    return (
        <div className="property-listing-six bg-pink-two pt-60 md-pt-80 pb-170 xl-pb-120 mt-150 xl-mt-120">
            <div className="container">
                <h4 className={'mb-20'}>Cho thuê nhà trọ, phòng trọ trên toàn quốc</h4>
                <div className="search-wrapper-one layout-one bg position-relative mb-55 md-mb-40">
                    <div className="bg-wrapper border-layout">
                        <DropdownTwo
                            filterData={filterData}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>

                {/* Hiển thị Loading khi đang tải */}
                {isLoading && <Loading/>}
                {filteredPosts.map((item: any) => (
                    <div key={item.id} className="listing-card-seven border-20 p-20 mb-30 wow fadeInUp">
                        <div className="d-flex flex-wrap layout-one">
                            <div
                                className={`img-gallery z-1 border-20 overflow-hidden`}>
                                {/*<div className={`tag border-20 ${item.tag_bg}`}>{item.tag}</div>*/}
                                {/* 03 <i className="fa-regular fa-image"></i>*/}
                                <Image src={item.firstImage} alt=""
                                       className="img-fluid w-100 h-100 object-fit-cover rounded-3"
                                       width={300}
                                       height={300}
                                       style={{objectFit: 'cover', borderRadius: '15px'}}
                                />
                            </div>
                            <div className="property-info">
                                <Link href="/listing_details_04" className="title tran3s mb-15">{item.title}</Link>
                                <div
                                    className="address">
                                    <i className="bi bi-geo-alt"></i>&nbsp;
                                    {item.address.province},&nbsp;{item.address.district},&nbsp;{item.address.commune}
                                </div>
                                <div className="mb-20 pt-20 pb-5 w-75">
                                       {truncateText(item.description, 160)}
                                </div>
                                <div
                                    className="pl-footer d-flex flex-wrap align-items-center justify-content-between">
                                    <div className={'d-flex gap-5 align-items-center'}>
                                        <strong
                                            className="price fw-500 me-auto"
                                            style={{color: "hsl(0,94%,42%)"}}>{item.monthlyRentCost.toLocaleString({
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })} đ{item.monthlyRentCost && <>/<sub>tháng</sub></>}</strong>
                                        <span className={'mt-10'}>
                                            <strong>{item.size}</strong> <span>m<sup>2</sup></span>
                                        </span>
                                    </div>
                                    <ul className="style-none d-flex action-icons on-top">
                                        <Link href="#"><i className="fa-light fa-heart"></i></Link>
                                    </ul>
                                    <Link href="/listing_details_04" className="btn-four rounded-circle"><i
                                        className="bi bi-arrow-up-right"></i></Link>
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
