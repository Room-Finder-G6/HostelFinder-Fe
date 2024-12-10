"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import InvoiceBody from "./InvoiceBody";
import { useState } from "react";

const DashboardSavedSearch = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>
         <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
         <InvoiceBody />
      </>
   )
}

export default DashboardSavedSearch;
