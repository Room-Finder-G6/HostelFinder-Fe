"use client";
import menu_data from "@/data/home-data/MenuData";
import Link from "next/link.js";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import logo from "@/assets/images/logo/logo_01.svg";
import '@/styles/index.scss'; // File chứa các thiết lập CSS
import './nav.css';
const NavMenu = () => {
    const pathname = usePathname();
    const currentRoute = usePathname();
    const [navTitle, setNavTitle] = useState("");

    const isMenuItemActive = (menuLink: string) => {
        return currentRoute === menuLink;
    };

    const isSubMenuItemActive = (subMenuLink: string) => {
        return currentRoute === subMenuLink;
    };

    //openMobileMenu
    const openMobileMenu = (menu: any) => {
        if (navTitle === menu) {
            setNavTitle("");
        } else {
            setNavTitle(menu);
        }
    };

    return (
        <ul className="navbar-nav align-items-lg-center" style={{fontStyle:"SansSerif"}}>
    <li className="d-block d-lg-none">
        <div className="logo">
            <Link href="/" className="d-block">
                <Image src={logo} alt="" />
            </Link>
        </div>
    </li>
    <li className="nav-item dashboard-menu">
        <Link className="nav-link" href="/dashboard/manage-hostels">Quản lý</Link>
    </li>
    <li className="nav-item admin-menu">
        <Link className="nav-link" href="/admin/admin-index">Admin</Link>
    </li>
    <li className="nav-item posts">
        <Link className="nav-link" href="/all-posts">Phòng trọ cho thuê</Link>
    </li>
    <li className="nav-item about-us">
        <Link className="nav-link" href="/about_us_01">Về chúng tôi</Link>
    </li>
    <li className="nav-item favorites">
        <Link className="nav-link d-flex align-items-center gap-2" href="/favorite">
            <i className="fa fa-heart" style={{ fontSize: "20px", color: "red" }}></i> 
            <span style={{ fontSize: "14px" }}></span>
        </Link>
    </li>
</ul>


    );
};

export default NavMenu;

