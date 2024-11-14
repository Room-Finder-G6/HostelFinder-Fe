import React from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import EditPostBody from "@/components/dashboard/edit-post/EditPostBody";

const DashboardEditPost = () => {
    return (
        <>
            <DashboardHeaderOne />
            <EditPostBody />
        </>
    );
};

export default DashboardEditPost;