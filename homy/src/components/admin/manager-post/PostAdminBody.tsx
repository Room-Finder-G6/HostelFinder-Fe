import Image from "next/image";
import Link from "next/link";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";

interface PostAdminBodyProps {
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
}

function PostAdminBody({ posts, loading }: PostAdminBodyProps) {
    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="text-center">Loading...</td>
                </tr>
            </tbody>
        );
    }

    if (posts.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="text-center">No posts found</td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody>
        {posts.map((post) => (
            <tr key={post.id}>
                {/* Cột Hình ảnh và Tiêu đề */}
                <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center">
                        {post.firstImage ? (
                            <Image
                                src={post.firstImage}
                                alt="Post Image"
                                width={80}
                                height={80}
                                className="rounded p-img"
                                style={{ marginRight: "15px", borderRadius: "8px" }}
                            />
                        ) : (
                            <div
                                className="placeholder-image"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    backgroundColor: "#ccc",
                                    marginRight: "15px",
                                    borderRadius: "8px",
                                }}
                            ></div>
                        )}
                        <span className="fw-bold text-dark">{post.title}</span>
                    </div>
                </td>
    
                {/* Cột Ngày tạo */}
                <td style={{ verticalAlign: "middle" }}>{new Date(post.createdOn).toLocaleDateString()}</td>
    
                {/* Cột Trạng thái */}
                <td style={{ verticalAlign: "middle" }}>
                    <span className={`badge ${post.status ? "bg-success" : "bg-danger"}`}>
                        {post.status ? "Active" : "Inactive"}
                    </span>
                </td>
    
                {/* Cột Mô tả */}
                <td style={{ verticalAlign: "middle" }}>
                    <p className="text-truncate" style={{ maxWidth: "250px", margin: "0" }}>
                        {post.description}
                    </p>
                </td>
    
                {/* Cột Địa chỉ */}
                <td style={{ verticalAlign: "middle" }}>
                    <p className="mb-1">{post.address.province}</p>
                    <p className="mb-1">{post.address.district}</p>
                    <p className="mb-1">{post.address.commune}</p>
                    <p className="mb-1">{post.address.detailAddress}</p>
                </td>
    
                {/* Cột Hành động */}
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
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
                                    <Image src={icon_3} alt="Edit Icon" className="lazy-img" /> Cập nhật
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="#">
                                    <Image src={icon_4} alt="Delete Icon" className="lazy-img" /> Xóa
                                </Link>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
    
    );
}

export default PostAdminBody;
