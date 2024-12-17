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
                    <td colSpan={4} className="text-center">Loading...</td>
                </tr>
            </tbody>
        );
    }

    if (posts.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={4} className="text-center">No posts found</td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody>
            {posts.map((post) => (
                <tr key={post.id}>
                    {/* Tiêu đề, Địa chỉ, và Mô tả */}
                    <td>
                        <div className="d-flex align-items-start">
                            {post.firstImage ? (
                                <Image
                                    src={post.firstImage}
                                    alt="Post Image"
                                    width={120}
                                    height={120}
                                    className="rounded me-3"
                                    style={{ objectFit: "cover", border: "1px solid #ddd" }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        backgroundColor: "#f0f0f0",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        marginRight: "12px",
                                    }}
                                ></div>
                            )}
                            <div className="flex-grow-1">
                                <h5 className="fw-bold text-dark mb-1">{post.title}</h5>
                                <p className="text-muted mb-1">
                                    {post.address.commune}, {post.address.district}, {post.address.province}
                                </p>
                                <p className="text-truncate mb-0" style={{ maxWidth: "500px" }}>
                                    {post.description}
                                </p>
                            </div>
                        </div>
                    </td>

                    {/* Ngày tạo */}
                    <td className="align-middle">
                        <span>{new Date(post.createdOn).toLocaleDateString()}</span>
                    </td>

                    {/* Trạng thái và Hành động */}
                    <td className="align-middle text-end">
                        <div className="d-flex align-items-center justify-content-end">
                            {/* Trạng thái */}
                            <span
                                className={`badge me-3 ${post.status ? "bg-success" : "bg-danger"}`}
                                style={{ fontSize: "12px", minWidth: "80px" }}
                            >
                                {post.status ? "Hoạt động" : "Không hoạt động"}
                            </span>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default PostAdminBody;
