"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import ReviewBody from "./ReviewBody"
import { useState } from "react";

const DashboardReview = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
      <ReviewBody />
    </>
  )
}

export default DashboardReview
