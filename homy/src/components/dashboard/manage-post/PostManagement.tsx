"use client";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import usePostsByUser from "./usePost";
import UserPostsBody from "./PropertyTableBodyPost";

const UserPostManagement = () => {
    const { posts, totalPages, pageIndex, setPageIndex, loading } = usePostsByUser();

    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="My Posts" />
            <div className="d-flex align-items-center justify-content-between mb-25">
                <li className="ms-auto">
                    <Link href="/dashboard/create-post" className="btn-two">
                        <span>Create New Post</span>
                    </Link>
                </li>
            </div>

            <div className="bg-white card-box p-4 border-20">
                <div className="table-responsive">
                    <table className="table property-list-table">
                        <thead>
                        <tr>
                                <th scope="col">Tiêu đề</th>
                                <th scope="col">Ngày Tạo</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Mô tả</th> 
                                <th scope="col">Địa chỉ</th> 
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <UserPostsBody posts={posts} loading={loading} />
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

export default UserPostManagement;
