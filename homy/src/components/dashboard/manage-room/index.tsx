"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import RoomManagement from "./RoomManage"
import { useState } from "react";
const DashboardManagerHostel = () => {
   const [isActive, setIsActive] = useState(false);

   return (
      <>
        <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
        <RoomManagement />
      </>
   )
}

export default DashboardManagerHostel
