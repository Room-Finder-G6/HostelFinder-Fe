"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import MessageBody from "./MessageBody"
import { useState } from "react";

const DashboardMessage = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
          <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <MessageBody />
      </>
   )
}

export default DashboardMessage
