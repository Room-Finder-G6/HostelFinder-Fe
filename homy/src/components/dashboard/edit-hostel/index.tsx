"use client";
import React, { useState } from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import EditHostelBody from "@/components/dashboard/edit-hostel/EditHostelBody";

const DashboardEditHostel = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <>
            <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
            <EditHostelBody />
        </>
    );
};

export default DashboardEditHostel;