"use client";
import menu_data from "@/data/home-data/MenuData";
import Link from "next/link.js";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/assets/images/logo/logo_01.svg";
import '@/styles/index.scss'; // File chứa các thiết lập CSS
import './nav.css';
import useNavData from "./useNavData";
import HeartButton from "./HeartButton";
import { jwtDecode } from "jwt-decode";
interface JwtPayload {
  UserId: string;
  Role: string;
}

const NavMenu = () => {
  const pathname = usePathname();
  // const { wishlistCount, role } = useNavData(); // Sử dụng hook để lấy dữ liệu wishlist và role
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentRoute = usePathname();
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

  const getUserIdFromToken = () => {
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
  };

  useEffect(() => {
    getUserIdFromToken();
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
          <Link className="nav-link dashboard-menu" href="/dashboard/manage-hostels">Quản lý</Link>
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

    </ul>
  );
};

export default NavMenu;
