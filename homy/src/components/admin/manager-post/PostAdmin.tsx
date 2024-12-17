"use client";
import AdminHeaderTwo from "@/layouts/headers/admin/AdminHeaderTwo";
import PostAdminBody from "./PostAdminBody";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import useAllPosts from "./useAllPost";

const PostAdmin = () => {
    const { posts, totalPages, pageIndex, setPageIndex, loading } = useAllPosts();

    return (
        <div className="dashboard-body">
            <AdminHeaderTwo title="TẤT CẢ BÀI ĐĂNG" />
            

            <div className="bg-white card-box p0 border-20">
                <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                    <table className="table property-list-table">
                        <thead>
                            <tr>
                                <th scope="col">Tiêu đề</th>
                                <th scope="col">Ngày Tạo</th>
                                <th scope="col">Trạng thái</th>
                            </tr>
                        </thead>
                        <PostAdminBody posts={posts} loading={loading} />
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

export default PostAdmin;
