"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import RoomManagement from "../manage-room/RoomManage";
import { useState } from "react"
const DashboardService = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <RoomManagement />
      </>
   )
}

export default DashboardService
