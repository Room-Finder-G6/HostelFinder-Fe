"use client";  // Đảm bảo là client-side component

import React, { useCallback, useEffect, useState } from 'react';
import Image from "next/image";
import dashboardAvatar from "@/assets/images/dashboard/avatar_01.jpg";
import Profile from "@/layouts/headers/dashboard/Profile";
import Link from "next/link";
import { jwtDecode } from 'jwt-decode';
import apiInstance from '@/utils/apiInstance';
import HeartButton from '../Menu/HeartButton';
import useNavData from '../Menu/useNavData';
import { usePathname } from 'next/navigation';  // Import đúng hook usePathname

interface JwtPayload {
    UserId: string;
}

const Authored = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [urlProfile, setUrlProfile] = useState<string>("");
    const pathname = usePathname();  // Sử dụng usePathname để lấy đường dẫn hiện tại
    const { wishlistCount, role } = useNavData(); // Sử dụng hook để lấy dữ liệu wishlist và role
    const currentRoute = pathname;  // Đặt giá trị của currentRoute bằng pathname
    const [navTitle, setNavTitle] = useState("");

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
    

    // Lấy thông tin người dùng từ API
    const fetchUserProfile = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiInstance.get(`/users/${userId}`);
            if (response.data && response.data.data) {
                const data = response.data.data;
                setUrlProfile(data.avatarUrl || dashboardAvatar); // Sử dụng avatar mặc định nếu không có avatar
            } else {
                setError("Không nhận được dữ liệu người dùng.");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to fetch user profile.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);
    

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            setUserId(userId);
        }
    }, [getUserIdFromToken]);

    useEffect(() => {
        if (userId) {
            fetchUserProfile(); // Gọi API khi userId được set
        }
    }, [userId, fetchUserProfile]);

    return (
        <div className="user-data d-flex align-items-center position-relative">
            <ul className="nav-item favorites">
                <HeartButton  wishlistCount={wishlistCount}  /> {/* Sử dụng HeartButton và truyền dữ liệu */}
            </ul>
       
            <button
                className="user-avatar online position-relative rounded-circle dropdown-toggle"
                type="button"
                id="profile-dropdown"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
                aria-label="User Profile"
            >
                <Image
                    src={urlProfile}
                    alt="User Avatar"
                    className="lazy-img"
                    width={60}
                    height={60}
                    style={{ borderRadius: "50%" }}
                />
            </button>
            {/* <Link href="/dashboard/create-post" className="btn-two ms-3" target="_blank">
                <span>Create Post</span>
                <i className="fa-thin fa-arrow-up-right"></i>
            </Link> */}
            <Profile />
        </div>
    );
};

export default Authored;
