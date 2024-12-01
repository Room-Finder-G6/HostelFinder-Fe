"use client";
import React, { useState } from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import WalletManagement from './WalletManagement';
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
const DashboardEditPost = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <>
            <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
            < WalletManagement/>
        </>
    );
};

export default DashboardEditPost;