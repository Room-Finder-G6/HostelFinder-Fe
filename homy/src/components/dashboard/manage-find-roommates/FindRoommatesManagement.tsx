
import { useState, useEffect, useCallback, useRef } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import useStorieByUser from "./useStorie";
import StoriePostsBody from "./StorieTableBodyPost";
import DeleteModal from "@/modals/DeleteModal";
import apiInstance from "@/utils/apiInstance";

const FindRoommatesManagement = () => {
    const { posts, totalPages, pageIndex, setPageIndex, loading, fetchPostsByUser } = useStorieByUser();
    const [sortOption, setSortOption] = useState<string>("1");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

    const prevPageIndexRef = useRef(pageIndex);
    const prevSortOptionRef = useRef(sortOption);

    const selectHandler = (e: any) => {
        const selectedValue = e.target.value;
        setSortOption(selectedValue);
    };



    const handleDeletePost = async () => {
        if (!selectedStoryId) return;

        try {
            const token = localStorage.getItem("token");
            const response = await apiInstance.delete(`/Story/${selectedStoryId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

           
            alert("Xóa bài viết thành công!");
            await fetchPostsByUser(pageIndex, sortOption);

        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Đã xảy ra lỗi khi xóa bài viết!");
        } finally {
            setShowDeleteModal(false);
            setSelectedStoryId(null);
        }
    };

    const handleDeleteClick = (postId: string) => {
        setSelectedStoryId(postId);
        setShowDeleteModal(true);
    };

    useEffect(() => {

        if (pageIndex !== prevPageIndexRef.current || sortOption !== prevSortOptionRef.current) {
            console.log("Fetching posts with", { pageIndex, sortOption });
            fetchPostsByUser(pageIndex, sortOption);

            prevPageIndexRef.current = pageIndex;
            prevSortOptionRef.current = sortOption;
        }
    }, [pageIndex, sortOption, fetchPostsByUser]);

    const sortPosts = useCallback(() => {
        const sortedPosts = [...posts];
        if (sortOption === "1") {
            sortedPosts.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
        } else if (sortOption === "2") {
            sortedPosts.sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
        }

        return sortedPosts;
    }, [posts, sortOption]);
    const sortedPosts = sortPosts();

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Bài đăng tìm ở ghép của tôi" />
                <div className="d-sm-flex align-items-center justify-content-between mb-25">
                    <div className="short-filter d-flex align-items-center me-3">
                        <div className="fs-16 me-2">Sắp xếp theo:</div>
                        <select
                            className="nice-select"
                            value={sortOption}
                            onChange={selectHandler}
                        >
                            <option value="1">Mới nhất</option>
                            <option value="2">Cũ nhất</option>
                        </select>

                    </div>

                    <div className="d-none d-md-inline-block ms-auto">
                        <Link href="/dashboard/create-post-roommates" className="btn-two">
                            <span>Thêm bài đăng</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white card-box p-4 border-20">
                    <div className="table-responsive">
                        <table className="table property-list-table">
                            <thead>
                                <tr>
                                    <th scope="col">Tiêu đề</th>
                                    <th scope="col">Ngày Tạo</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <StoriePostsBody posts={sortedPosts} loading={loading} onDeleteClick={handleDeleteClick} />
                        </table>
                    </div>
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

            <DeleteModal
                show={showDeleteModal}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa bài viết này không?"
                onConfirm={handleDeletePost}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default FindRoommatesManagement;