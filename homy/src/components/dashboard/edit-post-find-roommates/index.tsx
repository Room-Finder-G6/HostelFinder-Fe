"use client";
import React, {useState} from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import EditPostBody from "@/components/dashboard/edit-post-find-roommates/EditPostBody";

const DashboardEditPostFindRoommates = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive}/>
            <EditPostBody/>
        </>
    );
};

export default DashboardEditPostFindRoommates;