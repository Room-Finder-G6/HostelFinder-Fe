"use client"
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import AccountSettingBody from "./AccountSettingBody";
import { useState } from "react";

const DashboardAccountSetting = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <AccountSettingBody />
      </>
   )
}

export default DashboardAccountSetting;
