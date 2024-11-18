"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import PostAdmin from "./PostAdmin";
import { useState } from "react"
import AdminHeader from "@/layouts/headers/admin/AdminHeader";
const ManagerPostAdmin = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <AdminHeader isActive={isActive} setIsActive={setIsActive} />
         <PostAdmin />
      </>
   )
}

export default ManagerPostAdmin
