"use client";

import React, { useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import MembershipTableBody from "./MembershipTableBody";
import useMemberships from "./useMemberships";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import AdminHeaderTwo from "@/layouts/headers/admin/AdminHeaderTwo";
import EditMembershipForm from "./EditMembershipForm";
import { toast } from 'react-toastify'; // Import toast
import styles from "./styles.module.scss";

const MembershipManagement = () => {
    const { memberships, loading, totalPages, pageIndex, setPageIndex, deleteMembership, updateMembership } = useMemberships(); // Thêm updateMembership từ hook
    const [editingMembership, setEditingMembership] = useState(null); // State để lưu gói đang chỉnh sửa

    const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        console.log("Selected sort option:", selectedOption);
    };

    const handleEdit = (membership: any) => {
        setEditingMembership(membership); // Mở form chỉnh sửa với dữ liệu gói
    };

    const handleUpdate = (id: string, updatedData: any) => {
        updateMembership(id, updatedData); // Gọi API cập nhật
        setEditingMembership(null); // Đóng form sau khi chỉnh sửa xong
    };

    const handleCancel = () => {
        setEditingMembership(null); // Đóng form mà không lưu
    };




    return (
        <div className="dashboard-body membership-management">
            <AdminHeaderTwo title="Quản lý Gói Thành Viên" />
            {editingMembership ? (
                <EditMembershipForm
                    membership={editingMembership}
                    onSubmit={handleUpdate}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <div className="d-sm-flex align-items-center justify-content-between mb-25">
                        <div className="short-filter d-flex align-items-center ms-sm-auto">
                            {/* <NiceSelect
                                className="nice-select"
                                options={[
                                    { value: "1", text: "Mới nhất" },
                                    { value: "2", text: "Thành viên đang hoạt động" },
                                    { value: "3", text: "Thành viên đã hết hạn" },
                                ]}
                                defaultCurrent={0}
                                onChange={selectHandler}
                                placeholder="Sắp xếp" // Passing the placeholder here
                                name="membershipFilter" // Adding the name here
                            /> */}
                        </div>
                        <li className="d-none d-md-inline-block ms-3">
                            <Link href="/dashboard/add-membership" className="btn-two" target="_blank">
                                <span>Thêm Gói Thành Viên</span>
                            </Link>
                        </li>
                    </div>
                    <div className="bg-white card-box p0 border-20">
                        <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                            <table className="table property-list-table">
                                <thead>
                                    <tr style={{ fontSize: "10px" }}>
                                        <th scope="col">Gói Thành Viên</th>
                                        <th scope="col">Miêu tả</th>
                                        <th scope="col">Giá</th>
                                        <th scope="col">Số lượt đăng bài</th>
                                        <th scope="col">Hành Động</th>
                                    </tr>
                                </thead>
                                <MembershipTableBody
                                    memberships={memberships}
                                    loading={loading}
                                    onDelete={deleteMembership} // Truyền hàm xóa
                                    onEdit={handleEdit} // Truyền hàm edit
                                />
                            </table>
                        </div>
                    </div>
                    {/* Phân trang */}
                    <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={pageIndex === index + 1 ? "selected" : ""}>
                                <Link href="#" onClick={() => setPageIndex(index + 1)}>
                                    {index + 1}
                                </Link>
                            </li>
                        ))}
                        {totalPages > 1 && (
                            <li className="ms-2">
                                <Link href="#" onClick={() => setPageIndex(totalPages)}>
                                    Cuối <Image src={icon_1} alt="" className="ms-2" />
                                </Link>
                            </li>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default MembershipManagement;
