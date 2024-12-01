"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import SavedSearchBody from "./rentalContractBody";
import { useState } from "react";

const DashboardRentalContract = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <SavedSearchBody />
      </>
   )
}

export default DashboardRentalContract;
