"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import ServiceManagement from "./ServiceManagement"
import { useState } from "react"
const DashboardService = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <ServiceManagement />
      </>
   )
}

export default DashboardService
