"use client"
import Image from "next/image"
import Notification from "../dashboard/Notification";
import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_11.svg";
import Authored from "@/layouts/headers/right-header/Authored";

const AdminHeaderTwo = ({title}:any) => {

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
               <div className="profile-notification position-relative dropdown-center ms-3 ms-md-5 me-4">
                  <button className="noti-btn dropdown-toggle" type="button" id="notification-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                     <Image src={dashboardIcon_2} alt="" className="lazy-img" />
                     <div className="badge-pill"></div>
                  </button>
                  <Notification />
               </div>
             <Authored />
            </div>
         </header>
         <AdminHeader isActive={isActive} setIsActive={setIsActive} />
      </>
   )
}

export default AdminHeaderTwo
