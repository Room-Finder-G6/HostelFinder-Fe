
import { useState, useEffect, useCallback, useRef } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import useStorieByUser from "./useStorie";
import StoriePostsBody from "./StorieTableBodyPost";
import DeleteModal from "@/modals/DeleteModal";
import apiInstance from "@/utils/apiInstance";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaRocket, FaTools } from "react-icons/fa";

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
                <div className="feature-coming-soon">
                    <Container className="d-flex align-items-center justify-content-center min-vh-100">
                        <Row>
                            <Col>
                                <Card className="text-center bg-transparent border-0">
                                    <Card.Body>
                                        <FaRocket size={70} className="mb-4 text-white" />
                                        <Card.Title className="text-white">Tính Năng Sắp Ra Mắt</Card.Title>
                                        <Card.Text className="text-white-75 mb-4">
                                            Chúng tôi đang hoàn thiện tính năng này để mang đến trải nghiệm tốt nhất cho bạn. Hãy chờ đợi phiên bản tiếp theo!
                                        </Card.Text>
                                        <Button variant="primary" className="btn-gradient">
                                            Đăng Ký Nhận Thông Báo
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <style jsx>{`
            .feature-coming-soon {
                background-image: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80');
                background-size: cover;
                background-position: center;
                padding: 100px 0;
                position: relative;
                color: white;
              }
              
              .feature-coming-soon::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
              }
              
              .feature-coming-soon .container {
                position: relative;
                z-index: 1;
              }
              
              .btn-gradient {
                background: linear-gradient(45deg, #6a11cb, #2575fc);
                border: none;
                transition: background 0.3s ease;
              }
              
              .btn-gradient:hover {
                background: linear-gradient(45deg, #2575fc, #6a11cb);
              }
             `}</style>
        </div>
    );
};

export default FindRoommatesManagement;