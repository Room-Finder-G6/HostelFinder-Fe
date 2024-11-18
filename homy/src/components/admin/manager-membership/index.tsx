"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import MembershipManagement from "./MembershipManagement";
import { useState } from "react"
import AdminHeader from "@/layouts/headers/admin/AdminHeader";
const ManagerMembershipAdmin = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <AdminHeader isActive={isActive} setIsActive={setIsActive} />
         <MembershipManagement />
      </>
   )
}

export default ManagerMembershipAdmin
