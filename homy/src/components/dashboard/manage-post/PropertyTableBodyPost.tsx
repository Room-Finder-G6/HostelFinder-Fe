import styles from './UserPostsBody.module.css';
import Image from 'next/image';
import Link from 'next/link';
import {getUserIdFromToken} from "@/utils/tokenUtils";
import {toast} from "react-toastify";
import apiInstance from "@/utils/apiInstance";

interface UserPostsBodyProps {
    posts: {
        id: string;
        title: string;
        description: string;
        status: boolean;
        firstImage: string | null;
        createdOn: string;
        address: {
            province: string;
            district: string;
            commune: string;
            detailAddress: string;
        };
    }[];
    loading: boolean;
    onDeleteClick: (id: string) => void; // Hàm để xử lý sự kiện xóa bài viết
}

const UserPostsBody: React.FC<UserPostsBodyProps> = ({posts, loading, onDeleteClick}) => {
    const handlePushPost = async (postId: string) => {
        try {
            const userId = getUserIdFromToken();

            if (!userId) {
                toast.error('Không thể xác thực người dùng');
                return;
            }

            // Gửi userId trong URL như API endpoint mong đợi
            const response = await apiInstance.patch(`/posts/${postId}/push?userId=${userId}`);

            if (response.data.succeeded) {
                toast.success('Đẩy bài thành công');
            } else {
                toast.error(response.data.message || 'Đẩy bài không thành công');
            }
        } catch (error: any) {
            console.error('Error pushing post:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đẩy bài');
        }
    };

    if (posts.length === 0) {
        return (
            <tbody>
            <tr>
                <td colSpan={5} className="text-center">Không có bài đăng nào</td>
            </tr>
            </tbody>
        );
    }

    return (
        <tbody>
        {posts.map((post) => {
            // Kiểm tra xem createdOn có phải là một ngày hợp lệ không
            const formatDate = (dateString: any) => {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };

            return (
                <tr key={post.id}>
                    {/* Cột Hình ảnh và Tiêu đề */}
                    <td style={{verticalAlign: 'middle'}}>
                        <div className="d-flex align-items-start">
                            {post.firstImage ? (
                                <Image
                                    src={post.firstImage}
                                    alt="Post Image"
                                    width={400}
                                    height={250}
                                    className={styles.image}
                                />
                            ) : (
                                <div className={styles.placeholder}></div>
                            )}
                            <div>
                                <span className={styles.title}>{post.title}</span>
                                <p className={styles.address}>
                                    {`${post.address.commune}, ${post.address.district}, ${post.address.province}`}
                                </p>
                                <p className={styles.description}>
                                    {post.description.length > 100
                                        ? `${post.description.substring(0, 100)}...`
                                        : post.description}
                                </p>
                            </div>
                        </div>
                    </td>

                    {/* Cột Ngày tạo */}
                    <td style={{verticalAlign: 'middle'}}>
                        {formatDate(post.createdOn)}
                    </td>

                    {/* Cột Trạng thái */}
                    <td style={{verticalAlign: 'middle', whiteSpace: 'nowrap'}}>
                        <span
                            className={`${styles.badge} ${
                                post.status ? styles.success : styles.danger
                            }`}
                        >
                                {post.status ? 'Họat động' : 'Ẩn'}
                        </span>
                    </td>

                    {/* Cột Hành động */}
                    <td style={{verticalAlign: 'middle', textAlign: 'center'}}>
                        <div className="action-dots">
                            <button
                                className="action-btn dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <span>...</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" href={`/dashboard/edit-post/${post.id}`}>
                                        Xem và sửa
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handlePushPost(post.id)}
                                    >
                                        Đẩy bài
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => onDeleteClick(post.id)}
                                    >
                                        Xóa
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            );
        })}
        </tbody>
    );
};

export default UserPostsBody;
