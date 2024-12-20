"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Importing dashboard assets
import dashboardIconActive_1 from "@/assets/images/dashboard/icon/icon_1_active.svg";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_1.svg";
import dashboardIconActive_2 from "@/assets/images/dashboard/icon/icon_2_active.svg";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_2.svg";
import dashboardIconActive_3 from "@/assets/images/dashboard/icon/icon_3_active.svg";
import dashboardIcon_3 from "@/assets/images/dashboard/icon/icon_3.svg";
import dashboardIconActive_4 from "@/assets/images/dashboard/icon/icon_4_active.svg";
import dashboardIcon_4 from "@/assets/images/dashboard/icon/icon_4.svg";
import dashboardIconActive_5 from "@/assets/images/dashboard/icon/icon_5_active.svg";
import dashboardIcon_5 from "@/assets/images/dashboard/icon/icon_5.svg";
import dashboardIconActive_6 from "@/assets/images/dashboard/icon/icon_6_active.svg";
import dashboardIcon_6 from "@/assets/images/dashboard/icon/icon_6.svg";
import dashboardIconActive_7 from "@/assets/images/dashboard/icon/icon_7_active.svg";
import dashboardIcon_7 from "@/assets/images/dashboard/icon/icon_7.svg";
import dashboardIconActive_8 from "@/assets/images/dashboard/icon/icon_8_active.svg";
import dashboardIcon_8 from "@/assets/images/dashboard/icon/icon_8.svg";
import dashboardIconActive_9 from "@/assets/images/dashboard/icon/icon_9_active.svg";
import dashboardIcon_9 from "@/assets/images/dashboard/icon/room.svg";
import dashboardIconActive_10 from "@/assets/images/dashboard/icon/icon_10_active.svg";
import dashboardIcon_10 from "@/assets/images/dashboard/icon/icon_10.svg";
import dashboardIcon_11 from "@/assets/images/dashboard/icon/icon_31.svg";
import roomIcon from "@/assets/images/dashboard/icon/roomIconActive.svg";
import { jwtDecode } from "jwt-decode";

interface DashboardHeaderOneProps {
    isActive: boolean;
    setIsActive: (value: boolean) => void;
}

interface NavLinkProps {
    href: string;
    activeIcon: any;
    inactiveIcon: any;
    label: string;
    currentPath: string;
}

interface JwtPayload {
    UserId: string;
    Role: string;
}

// Tạo component NavLink riêng để tối ưu việc render
const NavLink: React.FC<NavLinkProps> = React.memo(({ href, activeIcon, inactiveIcon, label, currentPath }) => {
    const isActive = currentPath === href;

    return (
        <Link
            href={href}
            className={`d-flex w-100 align-items-center ${isActive ? 'active' : ''}`}
            prefetch={true}
        >
            <Image
                src={isActive ? activeIcon : inactiveIcon}
                alt={label}
                priority={isActive}
            />
            <span>{label}</span>
        </Link>

    );

});

NavLink.displayName = 'NavLink';

const DashboardHeaderOne: React.FC<DashboardHeaderOneProps> = ({ isActive, setIsActive }) => {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Hàm lấy userId từ token JWT
    const getUserIdFromToken = useCallback(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
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

    useEffect(() => {
        getUserIdFromToken();
    });


    // Định nghĩa navigation items để dễ quản lý và maintain
    const navigationItems = [
        {
            section: "main",
            items: [
                {
                    href: "/dashboard/dashboard-index",
                    activeIcon: dashboardIconActive_1,
                    inactiveIcon: dashboardIcon_1,
                    label: "Dashboard"
                },
                {
                    href: "/dashboard/message",
                    activeIcon: dashboardIconActive_2,
                    inactiveIcon: dashboardIcon_2,
                    label: "Message"
                },


            ]
        },
        {
            section: "profile",
            title: "Profile",
            items: [
                // {
                //     href: "/dashboard/profile",
                //     activeIcon: dashboardIconActive_3,
                //     inactiveIcon: dashboardIcon_3,
                //     label: "Profile"
                // },
                {
                    href: "/dashboard/account-settings",
                    activeIcon: dashboardIconActive_4,
                    inactiveIcon: dashboardIcon_4,
                    label: "Account Settings"
                },
                {
                    href: "/dashboard/membership",
                    activeIcon: dashboardIconActive_5,
                    inactiveIcon: dashboardIcon_5,
                    label: "Membership"
                }
            ]
        },
        {
            section: "listing",
            title: "Listing",
            items: [
                {
                    href: "/dashboard/reports",
                    activeIcon: dashboardIconActive_6,
                    inactiveIcon: dashboardIcon_6,
                    label: "Thống kê"
                },
                {
                    href: "/dashboard/manage-hostels",
                    activeIcon: dashboardIconActive_7,
                    inactiveIcon: dashboardIcon_7,
                    label: "Quản Lý Nhà Trọ"
                },
                {
                    href: "/dashboard/manage-room",
                    activeIcon: dashboardIconActive_7,
                    inactiveIcon: dashboardIcon_7,
                    label: "Quản Lý Phòng Trọ"
                },
                {
                    href: "/dashboard/manage-post",
                    activeIcon: dashboardIconActive_7,
                    inactiveIcon: dashboardIcon_7,
                    label: "Quản Lý Bài Đăng"
                },

                {
                    href: "/dashboard/saved-search",
                    activeIcon: dashboardIconActive_9,
                    inactiveIcon: dashboardIcon_9,
                    label: "Quản lí hóa đơn"
                },
                {
                    href: "/dashboard/review",
                    activeIcon: dashboardIconActive_10,
                    inactiveIcon: dashboardIcon_10,
                    label: "Reviews"
                }
            ]
        }
    ];

    return (
        <aside className={`dash-aside-navbar ${isActive ? "show" : ""}`}>
            <div className="position-relative">
                {/* Logo Section */}
                <div
                    className="logo d-md-block d-flex align-items-center justify-content-between plr bottom-line pb-20">
                    <Link
                        href="/"
                        prefetch={true}
                        className="logo-container"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <Image
                            src="/assets/images/logo/logo_06.svg"
                            alt="PhongTro24/7"
                            width={50}
                            height={50}
                            priority={true}
                        />
                        <span className="logo-text d-none d-lg-block" style={{ fontSize: "25px", color: "black", marginRight: "10px" }}>
                            <strong>&nbsp;PhongTro24/7</strong>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsActive(false)}
                        className="close-btn d-block d-md-none"
                    >
                        <i className="fa-light fa-circle-xmark"></i>
                    </button>
                </div>

                {/* Navigation Section */}
                <nav className="dasboard-main-nav pt-20 bottom-line">
                    <ul className="style-none">
                        {/*<li className="plr">
                            <Link href="/dashboard/dashboard-index" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/dashboard-index' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/dashboard-index' ? dashboardIconActive_1 : dashboardIcon_1} alt="Dashboard" />
                                <span>Dashboard</span>
                            </Link>
                        </li>*/}
                        {(role === 'Landlord' || role === "Admin" || role === "User") && (
                            <>
                                <li className="bottom-line pt-20 lg-pt-20 mb-30 lg-mb-30"></li>
                                <li>
                                    <div className="nav-title">Thông tin chung</div>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/profile"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/profile' ? 'active' : ''}`}>
                                        <Image
                                            src={pathname === '/dashboard/profile' ? dashboardIconActive_3 : dashboardIcon_3}
                                            alt="Profile" />
                                        <span>Thông tin cá nhân</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/deposit"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/deposit' ? 'active' : ''}`}>
                                        <i className="bi bi-cash"></i>
                                        <span>Nạp tiền</span>
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="plr">
                            <Link href="/dashboard/membership"
                                className={`d-flex w-100 align-items-center ${pathname === '/dashboard/membership' ? 'active' : ''}`}>
                                <Image
                                    src={pathname === '/dashboard/membership' ? dashboardIconActive_5 : dashboardIcon_5}
                                    alt="Membership" />
                                <span>Gói hội viên</span>
                            </Link>
                        </li>
                        {(role === 'Landlord') && (
                            <>
                                <li className="bottom-line pt-30 lg-pt-20 mb-40 lg-mb-30"></li>
                                <li>
                                    <div className="nav-title">Dành cho hội viên</div>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/dashboard-index" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/dashboard-index' ? 'active' : ''}`}>
                                        <Image src={pathname === '/dashboard/dashboard-index' ? dashboardIconActive_1 : dashboardIcon_1} alt="Dashboard" />
                                        <span>Thông tin chung</span>
                                    </Link>
                                    <Link href="/dashboard/reports"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/reports' ? 'active' : ''}`}>
                                        <Image
                                            src={pathname === '/dashboard/reports' ? dashboardIconActive_6 : dashboardIcon_6}
                                            alt="List Room" />
                                        <span>Thống kê</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/manage-post"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-post' ? 'active' : ''}`}>
                                        <i className="bi bi-card-text"></i>
                                        <span>Quản Lý Bài Đăng</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/manage-hostels"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-hostels' ? 'active' : ''}`}>
                                        <Image
                                            src={pathname === '/dashboard/manage-hostels' ? dashboardIconActive_7 : roomIcon}
                                            alt="Quản Lý Nhà Trọ" />
                                        <span>Quản Lý Nhà Trọ</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/manage-room"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-room' ? 'active' : ''}`}>
                                        <i className="bi bi-houses"></i>
                                        <span>Quản Lý Phòng Trọ</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/invoices"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/invoices' ? 'active' : ''}`}>
                                        <i className="bi bi-receipt"></i>
                                        <span>Quản Lý Hóa Đơn</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/manage-data-record"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-data-record' ? 'active' : ''}`}>
                                        <i className="bi bi-bag-heart"></i>
                                        <span>Quản Lý Ghi Số Liệu</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/manage-rental-contract"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-rental-contract' ? 'active' : ''}`}>
                                        <i className="bi bi-clipboard"></i>
                                        <span>Quản Lý Hợp Đồng</span>
                                    </Link>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/manage-maintenance"
                                        className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-maintenance' ? 'active' : ''}`}>
                                        <i className="bi bi-gear-fill"></i>
                                        <span>Sửa Chữa, Bảo Dưỡng</span>
                                    </Link>
                                </li>
                                <li className="plr bottom-line">
                                    <Link href="/dashboard/manage-tenant"
                                        className={`d-flex w-100 align-items-center mb-5 ${pathname === '/dashboard/manage-tenant' ? 'active' : ''}`}>
                                        <Image
                                            src={pathname === '/manage-tenant' ? dashboardIconActive_3 : dashboardIcon_3}
                                            alt="Reviews" />
                                        <span>Quản Lý Người Thuê</span>
                                    </Link>
                                </li>

                                {/*<li className="pt-20">
                                    <div className="nav-title">Tìm người ở ghép</div>
                                </li>
                                <li className="plr">
                                    <Link href="/dashboard/manage-find-roommates"
                                          className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-find-roommates' ? 'active' : ''}`}>
                                        <i className="bi bi-card-text"></i>
                                        <span>Đăng bài ở ghép</span>
                                    </Link>
                                </li>*/}
                            </>
                        )}
                    </ul>
                </nav>

                {/* Profile Completion Section */}
                <div className="profile-complete-status bottom-line pb-35 plr">
                    <div className="progress-line position-relative">
                        <div className="inner-line" style={{ width: "100%" }}></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default React.memo(DashboardHeaderOne);