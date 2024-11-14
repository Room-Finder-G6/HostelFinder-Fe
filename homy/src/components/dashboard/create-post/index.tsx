"use client"
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import AddPostBody from "./AddPostBody"
import { useState } from "react";
const DashboardAddProperty = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne setIsActive={setIsActive} isActive={isActive} />
         <AddPostBody />
      </>
   )
}

export default DashboardAddProperty
