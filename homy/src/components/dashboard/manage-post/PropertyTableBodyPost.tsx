import Image from "next/image";
import Link from "next/link";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";
import { useEffect, useState } from "react";

interface PropertyTableBodyPostProps {
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    images: File[]; // Giữ `images` dưới dạng `File[]`
    dateAvailable: string;
    membershipServiceId: string;
}

const PropertyTableBodyPost: React.FC<PropertyTableBodyPostProps> = ({ title, dateAvailable, status, images }) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        // Chuyển đổi các `File` thành URL khi component được mount
        const urls = images.map((file) => URL.createObjectURL(file));
        setImageUrls(urls);

        // Hủy URL khi component bị unmount
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    return (
        <tr>
            <td>
                <div className="d-lg-flex align-items-center position-relative">
                    {imageUrls.length > 0 && (
                        <Image src={imageUrls[0]} alt="Post Image" width={100} height={100} className="p-img" />
                    )}
                    <div className="ps-lg-4 md-pt-10">
                        <Link href="#" className="property-name tran3s color-dark fw-500 fs-20 stretched-link">
                            {title}
                        </Link>
                        <strong className="date-available">Available: {new Date(dateAvailable).toLocaleDateString()}</strong>
                    </div>
                </div>
            </td>
            <td>{status ? "Active" : "Inactive"}</td>
            <td>
                <div className="action-dots float-end">
                    <button
                        className="action-btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span></span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <Link className="dropdown-item" href={`/dashboard/edit-post/${title}`}>
                                <Image src={icon_3} alt="Edit Icon" className="lazy-img" /> Edit
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" href="#">
                                <Image src={icon_4} alt="Delete Icon" className="lazy-img" /> Delete
                            </Link>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
    );
};

export default PropertyTableBodyPost;
