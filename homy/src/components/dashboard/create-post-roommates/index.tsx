"use client";
import React, {useState} from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import CreatePostRoommatesBody from "@/components/dashboard/create-post-roommates/CreatePostRoommatesBody";

const DashboardCreatePostRoommates = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <DashboardHeaderOne setIsActive={setIsActive} isActive={isActive}/>
            <CreatePostRoommatesBody/>
        </>
    );
};

export default DashboardCreatePostRoommates;