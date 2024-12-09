"use client"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import apiInstance from "@/utils/apiInstance";
import titleShape from "@/assets/images/shape/title_shape_03.svg";
import Loading from "@/components/Loading";
import {Posts} from "@/models/posts";
import {truncateString} from "@/utils/stringUtils";

const Property = () => {
    const [posts, setposts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await apiInstance.get('posts/top/6');
                const postsData = Array.isArray(response.data.data) ? response.data.data : [];
                setposts(postsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading) {
        return <Loading/>
    }

    return (
        <div
            className="property-listing-one bg-pink-two mt-150 xl-mt-120 pt-140 xl-pt-120 lg-pt-80 pb-180 xl-pb-120 lg-pb-100">
            <div className="container">
                <div className="position-relative">
                    <div className="title-one text-center text-lg-start mb-30 xl-mb-25 lg-mb-20 wow fadeInUp">
                        <h3 style={{fontFamily: 'Arial, sans-serif'}}>
                            <span>Các bài đăng mới<Image src={titleShape} alt="" className="lazy-img"/></span>
                        </h3>
                        <p className="fs-22 mt-xs" style={{fontFamily: 'Arial, sans-serif'}}>
                            Khám phá những nhà trọ mới nhất và nổi bật.
                        </p>
                    </div>

                    <div className="row gx-xxl-5">
                        <div className="d-flex justify-content-end">
                            <Link href="/all-posts" className="btn btn-two btn-sm" data-wow-delay="0.1s">
                                <i className="bi bi-arrow-right-circle me-2"></i>Xem tất cả bài đăng
                            </Link>
                        </div>
                        {posts.map((post) => (
                            <div key={post.id} className="col-lg-4 col-md-6 d-flex mt-40 wow fadeInUp"
                                 data-wow-delay="0.1s">
                                <div className="listing-card-one border-25 h-100 w-100">
                                    <div className="img-gallery p-15">
                                        <div className="position-relative border-25 overflow-hidden"
                                             style={{aspectRatio: '18 / 12'}}>
                                            <div id={`carousel${post.id}`} className="carousel slide">
                                                <div className="carousel-inner">
                                                    <div className="carousel-item active" data-bs-interval="1000000">
                                                        <Link href={`/post-details/${post.id}`} className="d-block">
                                                            <Image
                                                                src={post.firstImage}
                                                                className="w-100"
                                                                alt={post.title}
                                                                width={500}
                                                                height={300}
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="property-info p-25">
                                        <Link href={`/post-details/${post.id}`}
                                              className="title tran3s"> {truncateString(post.title, 60)}</Link>
                                        <div
                                            className="address"> {`${post.address.commune}, ${post.address.district}`},<br/> {`${post.address.province}`}
                                        </div>
                                        <ul className="list-unstyled feature d-flex flex-wrap align-items-center">
                                            <li className="d-flex align-items-center w-100">
                                                <div className="d-flex align-items-center ms-2">
                                                    <i className="bi bi-house-door me-2"></i>
                                                    <span><strong>{post.size} m²</strong></span>
                                                </div>
                                                <span className="createOn ms-auto d-flex align-items-center me-2">
                                                    <i className="bi bi-calendar2-minus-fill me-1"></i>
                                                    {formatDate(post.createdOn)}
                                                </span>
                                            </li>
                                        </ul>

                                        <div
                                            className="pl-footer top-border d-flex align-items-center justify-content-between">
                                            <strong className="price fw-500 color-dark">
                                                {post.monthlyRentCost.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2
                                                })}
                                            </strong>
                                            <Link href={`/post-details/${post.id}`}
                                                  className="btn-four rounded-circle">
                                                <i className="bi bi-arrow-up-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Property;