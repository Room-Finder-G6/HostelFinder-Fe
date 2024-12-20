import {useState, useEffect, useCallback, useRef} from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import usePostsByUser from "./usePost";
import UserPostsBody from "./PropertyTableBodyPost";
import DeleteModal from "@/modals/DeleteModal";
import apiInstance from "@/utils/apiInstance";
import {toast} from "react-toastify";
import {useRouter} from 'next/navigation';
import {getUserIdFromToken} from "@/utils/tokenUtils";
import Loading from "@/components/Loading";

const UserPostManagement = () => {
    const {posts, totalPages, pageIndex, setPageIndex, loading, fetchPostsByUser} = usePostsByUser();
    const [sortOption, setSortOption] = useState<string>("1");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const prevPageIndexRef = useRef(pageIndex);
    const prevSortOptionRef = useRef(sortOption);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const selectHandler = (e: any) => {
        const selectedValue = e.target.value;
        setSortOption(selectedValue);
    };


    const handleDeletePost = async () => {
        if (!selectedPostId) return;

        try {
            setIsLoading(true);
            const response = await apiInstance.delete(`/posts/${selectedPostId}`, {
                params: {
                    postId: selectedPostId
                }
            });
            if (response.data.succeeded) {
                toast.success(response.data.message);
                setTimeout(() => {
                    window.location.href = '/dashboard/manage-post';
                }, 2000)
            }

        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Đã xảy ra lỗi khi xóa bài viết!");
        } finally {
            setShowDeleteModal(false);
            setSelectedPostId(null);
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (postId: string) => {
        setSelectedPostId(postId);
        setShowDeleteModal(true);
    };

    useEffect(() => {

        if (pageIndex !== prevPageIndexRef.current || sortOption !== prevSortOptionRef.current) {
            console.log("Fetching posts with", {pageIndex, sortOption});
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

    const userId = getUserIdFromToken();

    const checkUserHostelExist = async () => {
        try {
            const response = await apiInstance.post(`/posts/check-user-hostel/${userId}`);
            if (!response.data.succeeded) {
                toast.error(response.data.message);
            } else
                router.push('/dashboard/create-post');
        } catch (error) {
            console.error('Error checking user hostel:', error);
        }
    }

    return (
        <div className="dashboard-body">
            <div className="position-relative">

                {isLoading && <Loading/>}

                <DashboardHeaderTwo title="Bài đăng của tôi"/>
                <div className="d-flex align-items-center justify-content-between mb-25">
                    <div className="d-flex align-items-center ms-auto">
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

                        <button type='button' onClick={checkUserHostelExist} className="btn-two">
                            <span>Tạo bài đăng</span>
                        </button>
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
                            <UserPostsBody posts={sortedPosts} loading={loading} onDeleteClick={handleDeleteClick}/>
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
                                Last <Image src={icon_1} alt="" className="ms-2"/>
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
        </div>
    );
};

export default UserPostManagement;