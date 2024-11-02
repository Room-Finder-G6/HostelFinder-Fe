"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import PostManagement from "./PostManagement";
import { useState } from "react"
const DashboardManagerPost = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <PostManagement />
      </>
   )
}

export default DashboardManagerPost
