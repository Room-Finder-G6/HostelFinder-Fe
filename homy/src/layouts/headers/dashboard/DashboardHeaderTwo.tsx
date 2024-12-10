"use client"
import Image from "next/image"
import Notification from "./Notification";
import React, { useState } from "react";
import DashboardHeaderOne from "./DashboardHeaderOne";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_11.svg";
import Authored from "@/layouts/headers/right-header/Authored";
import './notification.css'
const DashboardHeaderTwo = ({ title }: any) => {

   const [isActive, setIsActive] = useState<boolean>(false);

   return (
      <>
         <header className="dashboard-header">
            <div className="d-flex align-items-center justify-content-end">
               <h4 className="m0 d-none d-lg-block">{title}</h4>
               <button onClick={() => setIsActive(true)} className="dash-mobile-nav-toggler d-block d-md-none me-auto">
                  <span></span>
               </button>
               <form onSubmit={(e) => e.preventDefault()} className="search-form ms-auto">
                  <input type="text" placeholder="Search here.." />
                  <button><Image src={dashboardIcon_1} alt="" className="lazy-img m-auto" /></button>
               </form>
               <Authored />
            </div>
         </header>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
      </>
   )
}

export default DashboardHeaderTwo
