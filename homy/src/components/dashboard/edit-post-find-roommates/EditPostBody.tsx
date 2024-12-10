import React from 'react';
import {useParams} from "next/navigation";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import EditPostForm from "@/components/dashboard/edit-post-find-roommates/EditPostForm";

const EditPostBody = () => {
    const { postId } = useParams();

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Cập nhật thông tin bài đăng ở ghép"/>
                <EditPostForm postId={postId as string} />
            </div>
        </div>
    );
};

export default EditPostBody;