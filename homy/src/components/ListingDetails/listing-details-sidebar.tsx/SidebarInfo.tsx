import Image from "next/image";
import Link from "next/link";

import { UserContext } from "@/components/ListingDetails/listing-details-1/ListingDetailsOneArea";
import { useContext } from "react";

const SidebarInfo = () => {
    const user = useContext(UserContext);

    if (!user) {
        return (
            <div className="text-center mt-25">
                <h6 className="name">No user data available</h6>
            </div>
        );
    }

    return (
        <>
            <Image src={user.avatarUrl} alt="User Avatar" className="lazy-img rounded-circle ms-auto me-auto mt-3 avatar"
                width={100} height={100} style={{ objectFit: "cover" }} />
            <div className="text-center mt-25">
                <h6 className="name">{user.fullName}</h6>
                <p className="fs-16">Chủ bất động sản</p>
                {/*<ul className="style-none d-flex align-items-center justify-content-center social-icon">
                    <li><Link href="#"><i className="fa-brands fa-facebook-f"></i></Link></li>
                    <li><Link href="#"><i className="fa-brands fa-twitter"></i></Link></li>
                    <li><Link href="#"><i className="fa-brands fa-instagram"></i></Link></li>
                    <li><Link href="#"><i className="fa-brands fa-linkedin"></i></Link></li>
                </ul>*/}
            </div>
            <div className="divider-line mt-40 mb-45 pt-20">
                <ul className="style-none">
                    <li>Email: <span><Link href={`mailto:${user.email}`}>{user.email}</Link></span></li>
                    <li>Phone: <span><Link href={`tel:${user.phone}`}>{user.phone}</Link></span></li>
                </ul>
            </div>
            <Link href="/contact" className="btn-nine text-uppercase rounded-3 w-100 mb-10">CONTACT AGENT</Link>
        </>
    );
};

export default SidebarInfo;
