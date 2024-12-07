"use client";
import menu_data from "@/data/home-data/MenuData";
import Link from "next/link.js";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import logo from "@/assets/images/logo/logo_01.svg";
import '@/styles/index.scss'; // File chứa các thiết lập CSS
import './nav.css';
import apiInstance from "@/utils/apiInstance"; // Giả sử bạn có một instance API để gọi backend
import { jwtDecode } from "jwt-decode";

// Interface khai báo payload của token JWT
interface JwtPayload {
    UserId: string;
    Role: string;
}

const NavMenu = () => {
    const pathname = usePathname();
    const [wishlistCount, setWishlistCount] = useState<number>(0);
    const currentRoute = usePathname();
    const [navTitle, setNavTitle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const isMenuItemActive = (menuLink: string) => {
        return currentRoute === menuLink;
    };

    const isSubMenuItemActive = (subMenuLink: string) => {
        return currentRoute === subMenuLink;
    };

    const openMobileMenu = (menu: any) => {
        if (navTitle === menu) {
            setNavTitle("");
        } else {
            setNavTitle(menu);
        }
    };

    // Hàm lấy userId từ token JWT
    const getUserIdFromToken = useCallback(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token); // Giải mã token để lấy userId
                setRole(decodedToken.Role);
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

    // Hàm lấy số lượng bài viết trong wishlist
    const updateWishlistCount = async () => {
        const token = localStorage.getItem('token');  // Lấy token từ localStorage
        const userId = getUserIdFromToken();  // Lấy userId từ token

        if (userId && token) {
            try {
                // Gửi userId và token trong header Authorization
                const response = await apiInstance.get(`/wishlists/count/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Gửi token trong header
                    },
                });

                // Kiểm tra response status và dữ liệu trả về
                if (response.status === 200) {
                    console.log("Wishlist count response:", response.data); // Kiểm tra dữ liệu trả về
                    if (response.data && response.data.count !== undefined) {
                        setWishlistCount(response.data.count); // Cập nhật số lượng
                    } else {
                        console.error("Dữ liệu trả về không hợp lệ:", response.data);
                    }
                } else {
                    console.error('Không thể lấy dữ liệu wishlist:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Lỗi khi lấy số lượng bài viết yêu thích:', error);
            }
        } else {
            console.error('Token hoặc userId không tồn tại');
        }
    };


    useEffect(() => {
        updateWishlistCount(); // Cập nhật số lượng khi component được render
    }, []);

    return (
        <ul className="navbar-nav align-items-lg-center" style={{ fontStyle: "SansSerif" }}>
            <li className="d-block d-lg-none">
                <div className="logo">
                    <Link href="/" className="d-block">
                        <Image src={logo} alt="" />
                    </Link>
                </div>
            </li>
            {(role === 'Landlord' || role === 'Admin') && (
                <li className="nav-item">
                    <Link className="nav-link" href="/dashboard/manage-hostels">Quản lý</Link>
                </li>
            )}
            {role === 'Admin' && (
                <li className="nav-item admin-menu">
                    <Link className="nav-link" href="/admin/admin-index">Admin</Link>
                </li>
            )}
            <li className="nav-item posts">
                <Link className="nav-link" href="/all-posts">Phòng trọ cho thuê</Link>
            </li>
            <li className="nav-item about-us">
                <Link className="nav-link" href="/dashboard/membership">Gói thành viên</Link>
            </li>
            <li className="nav-item about-us">
                <Link className="nav-link" href="/about_us_01">Về chúng tôi</Link>
            </li>
            <li className="nav-item favorites">
                <Link className="nav-link d-flex align-items-center gap-2" href="/favorite">
                    <i className="fa fa-heart"></i>
                    {wishlistCount > 0 && (
                        <span className="wishlist-badge">
                            {wishlistCount}
                        </span>
                    )}
                </Link>
            </li>


        </ul>
    );
};

export default NavMenu;
