"use client";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import MembershipGrid from "./MembershipGrid"; // Thành phần hiển thị danh sách các gói
import styles from "./MembershipPage.module.css";
import { useState } from "react";
const MembershipPage = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    
    <div className="dashboard-body">
        <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
      {/* Main Content */}
      <main className={styles.main}>
        {/* Navbar */}

        <DashboardHeaderTwo/>
  
        <div className={styles.banner}>
       <h1 style={{ color: "white" }}>GÓI HỘI VIÊN</h1>
          <ul>
            <li>Thảnh thơi đăng tin mà không lo biến động giá</li>
            <li>Sử dụng các tiện ích nâng cao dành cho hội viên</li>
          </ul>
        </div>

        {/* Membership Grid */}
        <MembershipGrid />
      </main>
    </div>
  );
};

export default MembershipPage;
