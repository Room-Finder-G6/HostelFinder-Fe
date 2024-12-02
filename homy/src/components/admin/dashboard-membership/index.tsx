"use client";
import React, { useState } from "react";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import DashboardMembership from "./DashboardMembership";
import AdminHeader from "@/layouts/headers/admin/AdminHeader";
import styles from "./ManagerPostAdmin.module.css"; // Import external CSS module for styles

const ManagerPostAdmin = () => {
   const [isActive, setIsActive] = useState(false);

   return (
      <div className={styles.container}>
         <AdminHeader isActive={isActive} setIsActive={setIsActive} />
         
         <div className={styles.content}>
            <DashboardMembership />
         </div>
      </div>
   );
}

export default ManagerPostAdmin;
