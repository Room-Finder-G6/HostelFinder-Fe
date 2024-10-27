"use client";
import React from 'react';
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import EditHostelForm from "@/components/dashboard/edit-hostel/EditHostelForm";
import {useParams} from "next/navigation";

const EditHostelBody = () => {
    const { hostelId } = useParams();
    
    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Sửa thông tin nhà trọ" />
                <EditHostelForm hostelId={hostelId as string} />
            </div>
        </div>
    );
};

export default EditHostelBody;