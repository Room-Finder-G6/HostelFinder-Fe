"use client"
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import AddPropertyBody from "./AddPropertyBody"
import { useState } from "react";
const DashboardAddProperty = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne setIsActive={setIsActive} isActive={isActive} />
         <AddPropertyBody />
      </>
   )
}

export default DashboardAddProperty
