"use client";
import React from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import UserTableBody from "./UserTableBody";
import useUsers from "./useUsers";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import AdminHeaderTwo from "@/layouts/headers/admin/AdminHeaderTwo";

const UserManagement = () => {
    const { users, loading, totalPages, pageIndex, setPageIndex } = useUsers();
    const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        console.log("Selected sort option:", selectedOption);
    };



    return (
        <div className="dashboard-body">
            <AdminHeaderTwo title="User Management" />
            <div className="d-sm-flex align-items-center justify-content-between mb-25">
                <div className="short-filter d-flex align-items-center ms-sm-auto">
                    <NiceSelect
                        className="nice-select"
                        options={[
                            { value: "1", text: "Newest" },
                            { value: "2", text: "Active Users" },
                            { value: "3", text: "Inactive Users" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name="sortOptions"
                        placeholder="Sort Users"
                    />
                </div>
                <li className="d-none d-md-inline-block ms-3">
                    <Link href="/dashboard/create-user" className="btn-two" target="_blank">
                        <span>Thêm người dùng</span>
                    </Link>
                </li>
            </div>

            <div className="bg-white card-box p0 border-20">
                <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                    <table className="table property-list-table">
                        <thead>
                            <tr>
                                <th scope="col">Avatar</th>
                                <th scope="col">Tên người dùng</th>
                                <th scope="col">Email</th>
                                <th scope="col">Số điện thoại</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <UserTableBody users={users} loading={loading} />
                    </table>
                </div>
            </div>

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
                            Last <Image src={icon_1} alt="" className="ms-2" />
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default UserManagement;
