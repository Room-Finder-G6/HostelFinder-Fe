"use client";
import Link from "next/link.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/assets/images/logo/logo_06.svg";
import '@/styles/index.scss'; // File chứa các thiết lập CSS

import HeartButton from "./HeartButton";
import useNavData from '../Menu/useNavData';
import { jwtDecode } from "jwt-decode";
import Notification from "../dashboard/Notification";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_11.svg";
interface JwtPayload {
  UserId: string;
  Role: string;
}

const NavMenu = () => {
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { wishlistCount } = useNavData();
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
          <Link href="/" className="d-block d-flex align-items-center">
            <Image src={logo} alt="" />
            <span className="logo-text" style={{
              fontSize: '25px',
              color: 'black',
              marginRight: '10px'
            }}><strong>&nbsp;PhongTro247</strong></span>
          </Link>
        </div>
      </li>
      {(role === 'Landlord' || role === 'Admin' || role === 'User') && (
        <li className="nav-item dashboard-menu">
          <Link className="nav-link" href="/dashboard/profile">Quản lý</Link>
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
      {/* <ul className="nav-item favorites">
        <HeartButton wishlistCount={wishlistCount} /> 
      </ul> */}
     
    </ul>

  );
};

export default NavMenu;
