"use client";
import React from "react";
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
                }
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
                    href: "/dashboard/properties-list",
                    activeIcon: dashboardIconActive_6,
                    inactiveIcon: dashboardIcon_6,
                    label: "List Room"
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
                    label: "Saved Search"
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
                <div className="logo d-md-block d-flex align-items-center justify-content-between plr bottom-line pb-30">
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
                        <span className="logo-text" style={{ fontSize: "25px", color: "black", marginRight: "10px" }}>
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
                <nav className="dasboard-main-nav pt-30 bottom-line">
                    <ul className="style-none">
                        <li className="plr">
                            <Link href="/dashboard/dashboard-index" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/dashboard-index' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/dashboard-index' ? dashboardIconActive_1 : dashboardIcon_1} alt="Dashboard" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/message" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/message' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/message' ? dashboardIconActive_2 : dashboardIcon_2} alt="Message" />
                                <span>Message</span>
                            </Link>
                        </li>
                        <li className="bottom-line pt-30 lg-pt-20 mb-40 lg-mb-30"></li>
                        <li>
                            <div className="nav-title">Profile</div>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/profile" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/profile' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/profile' ? dashboardIconActive_3 : dashboardIcon_3} alt="Profile" />
                                <span>Profile</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/account-settings" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/account-settings' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/account-settings' ? dashboardIconActive_4 : dashboardIcon_4} alt="Account Settings" />
                                <span>Account Settings</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/membership" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/membership' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/membership' ? dashboardIconActive_5 : dashboardIcon_5} alt="Membership" />
                                <span>Membership</span>
                            </Link>
                        </li>
                        <li className="bottom-line pt-30 lg-pt-20 mb-40 lg-mb-30"></li>
                        <li>
                            <div className="nav-title">Listing</div>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/properties-list" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/properties-list' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/properties-list' ? dashboardIconActive_6 : dashboardIcon_6} alt="List Room" />
                                <span>List Room</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/manage-hostels" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-hostels' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/manage-hostels' ? dashboardIconActive_7 : dashboardIcon_7} alt="Quản Lý Nhà Trọ" />
                                <span>Quản Lý Nhà Trọ</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/manage-room" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-room' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/manage-room' ? dashboardIconActive_1 : roomIcon} alt="Quản Lý Phòng Trọ" />
                                <span>Quản Lý Phòng Trọ</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/manage-post" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/manage-post' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/manage-post' ? dashboardIconActive_7 : dashboardIcon_7} alt="Quản Lý Bài Đăng" />
                                <span>Quản Lý Bài Đăng</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/favourites" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/favourites' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/favourites' ? dashboardIconActive_8 : dashboardIcon_8} alt="Favourites" />
                                <span>Favourites</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/saved-search" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/saved-search' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/saved-search' ? dashboardIconActive_9 : dashboardIcon_9} alt="Saved Search" />
                                <span>Saved Search</span>
                            </Link>
                        </li>
                        <li className="plr">
                            <Link href="/dashboard/review" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/review' ? 'active' : ''}`}>
                                <Image src={pathname === '/dashboard/review' ? dashboardIconActive_10 : dashboardIcon_10} alt="Reviews" />
                                <span>Reviews</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Profile Completion Section */}
                <div className="profile-complete-status bottom-line pb-35 plr">
                    <div className="progress-value fw-500">82%</div>
                    <div className="progress-line position-relative">
                        <div className="inner-line" style={{ width: "80%" }}></div>
                    </div>
                    <p>Profile Complete</p>
                </div>

                {/* Logout Button */}
                <div className="plr">
                    <Link
                        href="#"
                        className="d-flex w-100 align-items-center logout-btn"
                        prefetch={false}
                    >
                        <div className="icon tran3s d-flex align-items-center justify-content-center rounded-circle">
                            <Image src={dashboardIcon_11} alt="Logout" priority={false} />
                        </div>
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default React.memo(DashboardHeaderOne);