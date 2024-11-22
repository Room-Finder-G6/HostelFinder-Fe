import Image from "next/image";
import Link from "next/link";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";

interface PostAdminBodyProps {
    posts: {
        id: string;
        title: string;
        status: boolean;
        image: string | null;
        createdOn: string;
    }[];
    loading: boolean;
}

function PostAdminBodyProps({ posts, loading }: PostAdminBodyProps) {
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
                    <td>
                        <div className="d-lg-flex align-items-center position-relative">
                            {Array.isArray(post.image) && post.image.length > 0 && (
                                <Image src={post.image[0]} alt="Post Image" width={100} height={100} className="p-img" />
                            )}
                            <div className="ps-lg-4 md-pt-10">
                                <Link href="#" className="property-name tran3s color-dark fw-500 fs-20 stretched-link">
                                    {post.title}
                                </Link>
                            
                            </div>
                        </div>
                    </td>
                    <td>{new Date(post.createdOn).toLocaleDateString()}</td>
                    <td>{post.status ? "Active" : "Inactive"}</td>
                    <td>
                        <div className="action-dots float-end">
                            <button className="action-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span></span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" href={`/dashboard/edit-post/${post.id}`}>
                                        <Image src={icon_3} alt="Edit Icon" className="lazy-img" /> Edit
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="#">
                                        <Image src={icon_4} alt="Delete Icon" className="lazy-img" /> Delete
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

export default PostAdminBodyProps;
