"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import TenantManagement from "./TenantManagement"
import { useState } from "react"
const DashboardTenant = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <TenantManagement />
      </>
   )
}

export default DashboardTenant
