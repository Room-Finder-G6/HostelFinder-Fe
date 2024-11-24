"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import SavedSearchBody from "./SavedSearchBody";
import { useState } from "react";

const DashboardSavedSearch = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <SavedSearchBody />
      </>
   )
}

export default DashboardSavedSearch;
