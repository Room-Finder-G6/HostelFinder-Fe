"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import { useState } from "react"
import MeterReadingBody from "./ServiceManagement";
const DashboardService = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <MeterReadingBody />
      </>
   )
}

export default DashboardService
