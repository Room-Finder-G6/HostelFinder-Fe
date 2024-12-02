"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import AddMembership from "./AddMembership"
import { useState } from "react";
import AdminHeader from "@/layouts/headers/admin/AdminHeader";
const AddMembershipBody = () => {
   const [isActive, setIsActive] = useState(false);
   return (
      <>

         <AdminHeader isActive={isActive} setIsActive={setIsActive} />
         <AddMembership />
      </>
   )
}

export default AddMembershipBody
