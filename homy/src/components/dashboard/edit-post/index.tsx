"use client";
import React, { useState } from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import EditPostBody from "@/components/dashboard/edit-post/EditPostBody";

const DashboardEditPost = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <>
            <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
            <EditPostBody />
        </>
    );
};

export default DashboardEditPost;