"use client";

import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import HostelManagement from "./HostelManagement"
import {useState} from "react"

const DashboardManagerHostel = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <>
            <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive}/>
            <HostelManagement/>
        </>
    )
}

export default DashboardManagerHostel
