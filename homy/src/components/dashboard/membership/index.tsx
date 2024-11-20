"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import MembershipBody from "./MembershipBody";
import { useState } from "react";

const DashboardMembership = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
      <MembershipBody />
    </>
  )
}

export default DashboardMembership;
