"use client";
import React from 'react';
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import EditPostForm from "@/components/dashboard/edit-post/EditPostForm";
import {useParams} from "next/navigation";

const EditPostBody = () => {
    const { postId } = useParams();

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Cập nhật thông tin bài đăng"/>
                <EditPostForm postId={postId as string} />
            </div>
        </div>
    );
};

export default EditPostBody;