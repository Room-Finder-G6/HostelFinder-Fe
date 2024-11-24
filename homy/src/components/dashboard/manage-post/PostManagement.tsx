"use client";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBodyPost from "./PropertyTableBodyPost";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import usePostsByUser from "./usePost";

const PostManagement = () => {
    const { posts, totalPages, pageIndex, setPageIndex, loading } = usePostsByUser();

    const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
    };

    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="My Posts" />
            <div className="d-sm-flex align-items-center justify-content-between mb-25">
                <div className="short-filter d-flex align-items-center ms-sm-auto">
                    <NiceSelect
                        className="nice-select"
                        options={[
                            { value: "1", text: "Newest" },
                            { value: "2", text: "Best Seller" },
                            { value: "3", text: "Best Match" },
                            { value: "4", text: "Price Low" },
                            { value: "5", text: "Price High" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name="sortOptions"
                        placeholder="Select Option"
                    />
                </div>
                <li className="d-none d-md-inline-block ms-3">
                    <Link href="/dashboard/create-post" className="btn-two" target="_blank">
                        <span>Add Post</span>
                    </Link>
                </li>
            </div>

            <div className="bg-white card-box p0 border-20">
                <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                    <table className="table property-list-table">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Date Created</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <PropertyTableBodyPost posts={posts} loading={loading} />
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

export default PostManagement;
