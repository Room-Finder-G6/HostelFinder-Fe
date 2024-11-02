"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import ProfileBody from "./ProfileBody"
import { useState } from "react";
const DashboardProfile = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <ProfileBody />
      </>
   )
}

export default DashboardProfile
a