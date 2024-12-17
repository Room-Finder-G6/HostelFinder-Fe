"use client";
import Image from "next/image";
import Notification from "./Notification";
import React, { useState } from "react";
import DashboardHeaderOne from "./DashboardHeaderOne";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_11.svg";
import Authored from "@/layouts/headers/right-header/Authored";
import './notification.css';

const DashboardHeaderTwo = ({ title }: any) => {
   const [isActive, setIsActive] = useState<boolean>(false);

   return (
      <>
         <header className="dashboard-header">
            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
               <h4 className="m-0" style={{ margin: '0 20px', flexShrink: 0 }}>{title}</h4>
               <div className="header-controls d-flex align-items-center" style={{ gap: '20px' }}>
                  <button onClick={() => setIsActive(true)} className="dash-mobile-nav-toggler d-block d-lg-none">
                     <span></span>
                  </button>
                  <div className="profile-notification position-relative">
                     <button className="noti-btn dropdown-toggle" type="button" id="notification-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                        <Image src={dashboardIcon_2} alt="" className="lazy-img" />
                        <div className="badge-pill"></div>
                     </button>
                     <Notification />
                  </div>
                  <Authored />
               </div>
            </div>
         </header>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
      </>
   )
}

export default DashboardHeaderTwo;
