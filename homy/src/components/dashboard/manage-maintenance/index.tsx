"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import MainTenanceBody from "./maintenanceBody";
import { useState } from "react";

const DashboardMainTenance = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <MainTenanceBody />
      </>
   )
}

export default DashboardMainTenance;
