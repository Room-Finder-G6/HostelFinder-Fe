"use client";
import React, {useState} from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import FindRoommatesManagement from "@/components/dashboard/manage-find-roommates/FindRoommatesManagement";

const DashboardManageFindRoommates = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div>
            <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive}/>
            <FindRoommatesManagement/>
        </div>
    );
};

export default DashboardManageFindRoommates;