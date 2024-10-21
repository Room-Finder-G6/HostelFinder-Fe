"use client";
import Image from "next/image"
import Link from "next/link"
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";
import {useEffect, useState} from "react";
import apiInstance from "@/utils/apiInstance";
import {jwtDecode} from "jwt-decode";

interface DataType {
    id: string;
    hostelName: string;
    address: string;
    image: string;
    numberOfRooms: number;
    rating: number;
    createdOn: string;
}

interface JwtPayload {
    UserId: string;
}

const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token không tồn tại trong localStorage");
        return null;
    }

    try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        console.log("Decoded token:", decodedToken.UserId);
        return decodedToken.UserId;
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
    }
};

const PropertyTableBody = () => {
    const [hostels, setHostels] = useState<DataType[]>([])
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const userIdFromToken = getUserIdFromToken();
        setUserId(userIdFromToken);
    }, []);
    console.log("User ID:", userId);

    useEffect(() => {
        const fetchHostels = async () => {
            if (!userId) return;
            try {
                const response = await apiInstance.get(`hostels/GetHostelsByLandlordId/${userId}`);
                if (response.status === 200) {
                    const data: DataType[] = response.data;
                    console.log("Hostels:", data);
                    setHostels(data);
                } else {
                    console.error("Failed to fetch hostels");
                }
            } catch (error) {
                console.error("Error fetching hostels:", error);
            }
        };

        fetchHostels();
    }, [userId]);

    return (
        <tbody className="border-0">
        {hostels.map((item) => (
            <tr key={item.id}>
                <td>
                    <div className="d-lg-flex align-items-center position-relative">
                        <Image src={item.image} alt="" className="p-img"/>
                        <div className="ps-lg-4 md-pt-10">
                            <Link href="#"
                                  className="property-name tran3s color-dark fw-500 fs-20 stretched-link">{item.hostelName}</Link>
                            <div className="address">{item.address}</div>
                            <strong className="price color-dark">{item.numberOfRooms}</strong>
                        </div>
                    </div>
                </td>
                <td>{item.createdOn}</td>
                <td>{item.rating}</td>
                <td>
                    <div className="action-dots float-end">
                        <button className="action-btn dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            <span></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            {/*<li><Link className="dropdown-item" href="#"><Image src={icon_1} alt="" className="lazy-img" /> View</Link></li>
                        <li><Link className="dropdown-item" href="#"><Image src={icon_2} alt="" className="lazy-img" /> Share</Link></li>*/}
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
