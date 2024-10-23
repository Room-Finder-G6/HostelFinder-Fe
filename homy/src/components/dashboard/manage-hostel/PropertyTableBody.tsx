"use client";

import Image from "next/image"
import Link from "next/link"
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";
import {useEffect, useState, useCallback} from "react";
import apiInstance from "@/utils/apiInstance";
import {jwtDecode} from "jwt-decode";

interface Address {
    province: string;
    district: string;
    commune: string;
    detailAddress: string;
}

interface DataType {
    id: string;
    hostelName: string;
    description: string;
    address: Address;
    numberOfRooms: number;
    rating: number;
    image: string | null;
    coordinates: string;
    createdOn: string;
}

interface JwtPayload {
    UserId: string;
}

const PropertyTableBody = () => {
    const [hostels, setHostels] = useState<DataType[]>([])
    const [landlordId, setLandlordId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getUserIdFromToken = useCallback(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
                return decodedToken.UserId;
            } catch (error) {
                console.error("Error decoding token:", error);
                setError("Error decoding user token");
                return null;
            }
        }
        setError("No token found");
        return null;
    }, []);

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            setLandlordId(userId);
        }
    }, [getUserIdFromToken]);

    const fetchHostels = useCallback(async () => {
        if (!landlordId) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = window.localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            
            const response = await apiInstance.get(`hostels/GetHostelsByLandlordId/${landlordId}`)
            if (Array.isArray(response.data)) {
                setHostels(response.data);
            }
        } catch (error: any) {
            console.error("Error fetching hostels:", error);
            setError(error.message || "An error occurred while fetching hostels");
        } finally {
            setIsLoading(false);
        }
    }, [landlordId]);

    useEffect(() => {
        if (landlordId) {
            fetchHostels();
        }
    }, [landlordId, fetchHostels]);

    if (isLoading) {
        return <tbody>
        <tr>
            <td colSpan={4}>Loading...</td>
        </tr>
        </tbody>;
    }

    if (error) {
        return <tbody>
        <tr>
            <td colSpan={4}>Error: {error}</td>
        </tr>
        </tbody>;
    }

    if (hostels.length === 0) {
        return <tbody>
        <tr>
            <td colSpan={4}>No hostels found</td>
        </tr>
        </tbody>;
    }

    return (
        <tbody className="border-0">
        {hostels.map((item) => (
            <tr key={item.id}>
                <td>
                    <div className="d-lg-flex align-items-center position-relative">
                        {item.image && <Image src={item.image} alt="" className="p-img"/>}
                        <div className="ps-lg-4 md-pt-10">
                            <Link href="#"
                                  className="property-name tran3s color-dark fw-500 fs-20 stretched-link">{item.hostelName}</Link>
                            <div
                                className="address">{`${item.address.detailAddress}, ${item.address.commune}, ${item.address.district}, ${item.address.province}`}</div>
                            <strong className="price color-dark">{item.numberOfRooms} rooms</strong>
                        </div>
                    </div>
                </td>
                <td>{new Date(item.createdOn).toLocaleDateString()}</td>
                <td>{item.rating}</td>
                <td>
                    <div className="action-dots float-end">
                        <button className="action-btn dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            <span></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" href="#"><Image src={icon_3} alt=""
                                                                                className="lazy-img"/> Edit</Link></li>
                            <li><Link className="dropdown-item" href="#"><Image src={icon_4} alt=""
                                                                                className="lazy-img"/> Delete</Link>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        ))}
        </tbody>
    )
}

export default PropertyTableBody