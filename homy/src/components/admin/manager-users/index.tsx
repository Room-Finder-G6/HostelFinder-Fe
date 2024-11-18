"use client";

import React, { useState } from "react";
import AdminHeader from "@/layouts/headers/admin/AdminHeader";
import UserManagement from "./UserManagement";

const ManagerUsersAdmin = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <AdminHeader isActive={isActive} setIsActive={setIsActive} />
            <UserManagement />
        </>
    );
};

export default ManagerUsersAdmin;
