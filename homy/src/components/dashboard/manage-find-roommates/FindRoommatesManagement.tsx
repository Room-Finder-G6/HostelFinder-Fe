"use client";
import React from 'react';
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";

const FindRoommatesManagement = () => {
    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Bài đăng tìm ở ghép của tôi"/>
                <h2 className="main-title d-block d-lg-none">Quản lý nhà trọ</h2>
                <div className="d-sm-flex align-items-center justify-content-between mb-25">
                    <div className="d-none d-md-inline-block ms-auto">
                        <Link href="/dashboard/create-post-roommates" className="btn-two">
                            <span>Thêm bài đăng</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white card-box p0 border-20">
                </div>
            </div>
        </div>

    );
};

export default FindRoommatesManagement;