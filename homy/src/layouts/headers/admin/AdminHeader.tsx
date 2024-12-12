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

interface AdminHeaderProps {
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

const AdminHeader: React.FC<AdminHeaderProps> = ({ isActive, setIsActive }) => {
    const pathname = usePathname();

    // Định nghĩa navigation items để dễ quản lý và maintain
    const navigationItems = [
        {
            section: "main",
            items: [
                {
                    href: "/admin/admin-index",
                    activeIcon: dashboardIconActive_1,
                    inactiveIcon: dashboardIcon_1,
                    label: "Admin"
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
            section: "listing",
            title: "Listing",
            items: [
                {
                    href: "/admin/dashboard-membership",
                    activeIcon: dashboardIconActive_4,
                    inactiveIcon: dashboardIcon_4,
                    label: "Thống Kê Gói Người Dùng"
                },
                {
                    href: "https://my.payos.vn/a1cd337babcb11ef964c0242ac110002/dashboard",
                    activeIcon: dashboardIconActive_4,
                    inactiveIcon: dashboardIcon_4,
                    label: "Thống Kê Tiền Nạp Hệ Thống"
                },
                {
                    href: "/admin/manager-membership",
                    activeIcon: dashboardIconActive_8,
                    inactiveIcon: dashboardIcon_8,
                    label: "Quản Lý MemberShip"
                },
                
                {
                    href: "/admin/manager-post",
                    activeIcon: dashboardIconActive_6,
                    inactiveIcon: dashboardIcon_6,
                    label: "Quản Lý Bài Đăng"
                },
                {
                    href: "/admin/manager-users",
                    activeIcon: dashboardIconActive_3,
                    inactiveIcon: dashboardIcon_3,
                    label: "Quản Lý Người Dùng"
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
                <nav className="dasboard-main-nav pt-30 pb-30 bottom-line">
                    <ul className="style-none">
                        {navigationItems.map((section, idx) => (
                            <React.Fragment key={section.section}>
                                {section.title && (
                                    <li>
                                        <div className="nav-title">{section.title}</div>
                                    </li>
                                )}
                                {section.items.map((item) => (
                                    <li className="plr" key={item.href}>
                                        <NavLink
                                            href={item.href}
                                            activeIcon={item.activeIcon}
                                            inactiveIcon={item.inactiveIcon}
                                            label={item.label}
                                            currentPath={pathname}
                                        />
                                    </li>
                                ))}
                                {idx < navigationItems.length - 1 && (
                                    <li className="bottom-line pt-30 lg-pt-20 mb-40 lg-mb-30"></li>
                                )}
                            </React.Fragment>
                        ))}
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

export default React.memo( AdminHeader);