"use client"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import apiInstance from "@/utils/apiInstance";
import titleShape from "@/assets/images/shape/title_shape_03.svg";
import Loading from "@/components/Loading";

interface RoomData {
    id: string;
    title: string;
    address: string | null;
    size: number;
    primaryImageUrl: string;
    monthlyRentCost: number;
}

const Property = () => {
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await apiInstance.get('rooms/GetFilteredRooms');
                const roomsData = Array.isArray(response.data.data) ? response.data.data : [];
                setRooms(roomsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rooms:', error);
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
                    <div className="title-one text-center text-lg-start mb-45 xl-mb-30 lg-mb-20 wow fadeInUp">
                        <h3 style={{fontFamily: 'Arial, sans-serif'}}>
                            <span>Các bài đăng mới <Image src={titleShape} alt="" className="lazy-img"/></span>
                        </h3>
                        <p className="fs-22 mt-xs" style={{fontFamily: 'Arial, sans-serif'}}>
                            Khám phá những nhà trọ mới nhất và nổi bật.
                        </p>
                    </div>

                    <div className="row gx-xxl-5">
                        {rooms.map((room) => (
                            <div key={room.id} className="col-lg-4 col-md-6 d-flex mt-40 wow fadeInUp"
                                 data-wow-delay="0.1s">
                                <div className="listing-card-one border-25 h-100 w-100">
                                    <div className="img-gallery p-15">
                                        <div className="position-relative border-25 overflow-hidden">
                                            <div id={`carousel${room.id}`} className="carousel slide">
                                                <div className="carousel-inner">
                                                    <div className="carousel-item active" data-bs-interval="1000000">
                                                        <Link href={`/post-details/${room.id}`} className="d-block">
                                                            <Image
                                                                src={room.primaryImageUrl.startsWith('http') ? room.primaryImageUrl : `/${room.primaryImageUrl}`}
                                                                className="w-100"
                                                                alt={room.title}
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
                                        <Link href={`/post-details/${room.id}`}
                                              className="title tran3s">{room.title}</Link>
                                        <div
                                            className="address">{room.address ? room.address : 'Không có thông tin địa chỉ'}</div>
                                        <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between">
                                            <li className="d-flex align-items-center">
                                                <i className="bi bi-house-door"></i>
                                                <span className="">&nbsp;<strong>{room.size} m²</strong></span>
                                            </li>
                                        </ul>
                                        <div
                                            className="pl-footer top-border d-flex align-items-center justify-content-between">
                                            <strong className="price fw-500 color-dark">
                                                {room.monthlyRentCost.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2
                                            })}
                                            </strong>
                                            <Link href={`/post-details/${room.id}`}
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