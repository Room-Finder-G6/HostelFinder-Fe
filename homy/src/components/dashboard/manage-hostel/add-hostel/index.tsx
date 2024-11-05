"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import AddHostelBody from "./AddHostelBody"
import { useState } from "react";
const DashboardAddHostel = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <AddHostelBody />
      </>
   )
}

export default DashboardAddHostel
