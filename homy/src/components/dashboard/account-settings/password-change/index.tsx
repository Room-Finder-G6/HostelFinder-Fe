"use client"
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import PasswordChangeBody from "./PasswordChangeBody"
import { useState } from "react";

const PasswordChange = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <PasswordChangeBody />
      </>
   )
}

export default PasswordChange
