"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import PropertyListBody from "./PropertyListBody"
import { useState } from "react";

const PropertyList = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
       <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <PropertyListBody />
      </>
   )
}

export default PropertyList
