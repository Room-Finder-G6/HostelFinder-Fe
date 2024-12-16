import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import Loading from "@/components/Loading";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import RoomSelector from "./RoomSelector";
import { AxiosError } from 'axios';
import './tenant.css'
interface Room {
    id: string;
    roomName: string;
}

interface Hostel {
    id: string;
    hostelName: string;
}

interface Tenant {
    roomId: string;
    tenancyId: string;
    id: string;
    roomName: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    moveInDate: string;
    moveOutDate: string;
    status: string;
    province: string;
    district: string;
    commune: string;
    detailAddress: string;
    identityCardNumber: string;
}

const TenantManagement = () => {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [selectedHostelId, setSelectedHostelId] = useState<string>("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
    const [searchQuery, setSearchQuery] = useState<string>(""); // Từ khóa tìm kiếm
    const [page, setPage] = useState(1); // Trang hiện tại
    const [roomData, setRoomData] = useState<Room | null>(null);
    const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [newTenant, setNewTenant] = useState<any>({
        roomId: "",
        fullName: "",
        avatarImage: null,
        email: "",
        phone: "",
        description: "",
        dateOfBirth: "",
        moveInDate: "",
        province: "",
        district: "",
        commune: "",
        detailAddress: "",
        identityCardNumber: "",
        frontImage: null,
        backImage: null,
        temporaryResidenceStatus: "",
    });

    // Hàm fetch danh sách tenants theo hostelId
    const fetchTenants = async (hostelId: string, page: number, searchQuery: string, status: string) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(
                `/Tenants/GetAllTenantsByHostel/${hostelId}`,
                {
                    params: {
                        pageNumber: page,
                        pageSize: 10,
                        status: status || null, // Gửi trạng thái nếu có
                        searchQuery: searchQuery || null, // Gửi từ khóa tìm kiếm nếu có
                    },
                }
            );
            if (response.data.succeeded) {
                const fetchedTenants = response.data.data;
                const filteredTenants = response.data.data.filter((tenant: Tenant) => {
                    // Lọc tenant theo phòng nếu `roomName` hoặc `roomId` chứa `searchQuery`
                    return tenant.roomName.includes(searchQuery); // Có thể thay "roomName" bằng trường phù hợp
                });
                setTenants(filteredTenants);
                setFilteredTenants(filteredTenants); // Gán danh sách đã lọc
                setTotalPages(Math.ceil(response.data.totalRecords / 10));
            } else {
                toast.error("Không thể tải danh sách tenants.");
                setTenants([]); // Fallback to an empty array
                setFilteredTenants([]);
            }
            const totalRecords = response.data.totalRecords;
            setTotalPages(Math.ceil(totalRecords / 10));
        } catch (error) {
            toast.error("Lỗi khi tải danh sách tenants.");
            setTenants([]); // Fallback to an empty array
            setFilteredTenants([]);
        }
        setLoading(false);
    };



    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus); // Cập nhật trạng thái đã chọn
        setPage(1); // Reset về trang đầu tiên
        fetchTenants(selectedHostelId, 1, searchQuery, newStatus); // Fetch dữ liệu với trạng thái mới
    };
    ;



    // Hàm fetch danh sách phòng theo hostelId
    const fetchRooms = async (hostelId: string) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/rooms/hostels/${hostelId}`);
            if (response.data.succeeded) {
                setRooms(response.data.data);
            } else {
                const errorMessage = response.data.message;
                toast.error(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
        setLoading(false);
    };
    // Hàm thay đổi trang
    const handlePageChange = (newPage: number) => {
        setPage(newPage); // Cập nhật số trang
        fetchTenants(selectedHostelId, newPage, searchQuery, selectedStatus); // Fetch dữ liệu với trạng thái và từ khóa
    };

    // Hàm tìm kiếm phòng trọ theo tên
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query); // Cập nhật từ khóa tìm kiếm
        setPage(1); // Reset về trang đầu tiên
        fetchTenants(selectedHostelId, 1, query, selectedStatus); // Fetch dữ liệu với từ khóa mới
    };

    // Hàm xử lý thay đổi nhà trọ
    const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const hostelId = e.target.value;
        setSelectedHostelId(hostelId);
        setPage(1); // Reset trang về 1
        setTenants([]); // Reset tenants khi thay đổi hostel
        fetchRooms(hostelId); // Lấy phòng của hostel đã chọn
        fetchTenants(hostelId, 1, searchQuery, selectedStatus); // Lấy tenants của hostel đã chọn
    };
    useEffect(() => {
        if (roomData) {
            // Lúc này bạn có thể cập nhật giao diện hoặc thực hiện các hành động khi `roomData` thay đổi
            console.log("Room data updated:", roomData);
        }
    }, [roomData]); // Chạy lại khi `roomData` thay đổi
    const handleMoveOut = async (tenantId: string, roomId: string) => {
        setLoading(true);
        try {
            // Gửi yêu cầu MoveOut đến API
            const response = await apiInstance.post(`/Tenants/moveout?tenantId=${tenantId}&roomId=${roomId}`);

            if (response.data.succeeded) {
                // Sau khi move out thành công, làm mới dữ liệu về phòng
                toast.success("Thành viên đã chuyển ra khỏi phòng thành công.");
                // Gọi lại API để lấy thông tin phòng cập nhật
                const updatedRoom = await apiInstance.get(`/Rooms/${roomId}`);
                console.log(updatedRoom.data);  // Kiểm tra dữ liệu trả về
                setRoomData(updatedRoom.data); // Cập nhật state
            } else {
                const errorMessage = response.data.message || "Lỗi khi chuyển thành viên ra khỏi phòng.";
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error("Move out error:", error);
            const errorMessage = error.response?.data?.message || "Lỗi khi chuyển thành viên ra khỏi phòng.";
            toast.error(errorMessage);
        }
        setLoading(false);
    };
    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        setNewTenant((prev: any) => ({
            ...prev,
            roomId,
        }));
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if (target instanceof HTMLInputElement && target.type === 'file') {
            const files = target.files;
            if (files && files.length > 0) {
                setNewTenant((prev: any) => ({
                    ...prev,
                    [name]: files[0],
                }));
            }
        } else {
            setNewTenant((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    // Mở/Đóng modal
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData = new FormData();

        // Thêm thông tin tenant vào FormData
        formData.append("RoomId", newTenant.roomId); // Sửa theo logic của bạn
        formData.append("FullName", newTenant.fullName);
        formData.append("Email", newTenant.email);
        formData.append("Phone", newTenant.phone);
        formData.append("DateOfBirth", newTenant.dateOfBirth);
        formData.append("MoveInDate", newTenant.moveInDate);
        formData.append("Description", newTenant.description || "");
        formData.append("Province", newTenant.province);
        formData.append("District", newTenant.district);
        formData.append("Commune", newTenant.commune);
        formData.append("DetailAddress", newTenant.detailAddress);
        formData.append("IdentityCardNumber", newTenant.identityCardNumber);
        formData.append("TemporaryResidenceStatus", newTenant.temporaryResidenceStatus);

        // Kiểm tra và thêm ảnh vào FormData nếu có
        if (newTenant.avatarImage) {
            formData.append("AvatarImage", newTenant.avatarImage); // File Avatar
        } else {
            formData.append("AvatarImage", "https://hostel-finder-images.s3.ap-southeast-1.amazonaws.com/Default-Avatar.png"); // Avatar mặc định
        }

        if (newTenant.frontImage) {
            formData.append("FrontImageImage", newTenant.frontImage); // File FrontImage
        } else {
            formData.append("FrontImageImage", "https://hostel-finder-images.s3.ap-southeast-1.amazonaws.com/Default-Front.png"); // Front Image mặc định
        }

        if (newTenant.backImage) {
            formData.append("BackImageImage", newTenant.backImage); // File BackImage
        } else {
            formData.append("BackImageImage", "https://hostel-finder-images.s3.ap-southeast-1.amazonaws.com/Default-Back.png"); // Back Image mặc định
        }

        try {
            const response = await apiInstance.post("/rooms/AddRoommate", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success("Thêm thành viên thành công!");
                toggleModal();
                fetchTenants(selectedHostelId, page, searchQuery, selectedStatus); // Lấy lại danh sách tenants
            } else {
                toast.error(`Có lỗi khi thêm thành viên: ${response.data.message || 'Không xác định'}`);
            }
        } catch (error) {
            toast.error("Phòng đã đầy, không thể thêm người thuê");
            console.error("Error uploading data:", error);
        }
    };

    useEffect(() => {
        if (selectedHostelId) {
            fetchTenants(selectedHostelId, page, searchQuery, selectedStatus); // Fetch dữ liệu với tất cả các tham số
            fetchRooms(selectedHostelId);
        }
    }, [selectedHostelId, page, searchQuery, selectedStatus]); // Chạy lại khi một trong các tham số thay đổi


    useEffect(() => {
        let updatedTenants = [...tenants]; // Sao chép mảng ban đầu
        if (selectedStatus) {
            updatedTenants = updatedTenants.filter((tenant) => tenant.status && tenant.status === selectedStatus);
        }
        console.log("Filtered tenants:", updatedTenants);
        setFilteredTenants(updatedTenants); // Cập nhật danh sách đã lọc
    }, [tenants, selectedStatus]);

    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="Quản lý người thuê" />

            <div className="d-flex align-items-center gap-4 mb-4">
                <RoomSelector
                    selectedHostel={selectedHostelId}
                    onHostelChange={handleHostelChange}
                    selectedRoom={""}
                    onRoomChange={() => { }}
                />
            </div>
            {loading &&
                <Loading />
            }

            <input
                type="text"
                name="room"
                placeholder="Tìm kiếm phòng"
                value={searchQuery}
                onChange={handleSearchChange}  // Xử lý tìm kiếm khi người dùng nhập
                className="form-control mb-2"
                required
            />
            <select value={selectedStatus} onChange={handleStatusChange} className="form-select">
                <option value="">Tất cả trạng thái</option>
                <option value="Đang thuê">Đang thuê</option>
                <option value="Đã rời phòng">Đã rời phòng</option>
            </select>
            {loading && <Loading />}

            <button className="btn btn-primary mb-3" onClick={toggleModal} disabled={!selectedHostelId}>
                Thêm thành viên
            </button>

            {isModalOpen && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm thành viên</h5>
                                <button type="button" className="btn-close" onClick={toggleModal}></button>
                            </div>
                            <div className="modal-body">

                                <div className="form-group">
                                    <label htmlFor="roomSelect">Chọn phòng:</label>
                                    <select
                                        id="roomSelect"
                                        className="form-select mt-2"
                                        value={newTenant.roomId}
                                        onChange={handleRoomChange}  // Gọi handleRoomChange khi thay đổi
                                        required
                                    >
                                        <option value="">Chọn phòng</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.roomName}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    value={newTenant.fullName}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <div className="file-upload-container">
                                    <label htmlFor="avatarImage" className="form-label">Ảnh đại diện:</label>
                                    <input
                                        type="file"
                                        name="avatarImage"
                                        placeholder="Ảnh đại diện"
                                        onChange={handleInputChange}
                                        className="form-control mb-2"
                                        required
                                    />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={newTenant.email}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    value={newTenant.phone}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Mô tả"
                                    value={newTenant.description}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                />

                                <div className="file-upload-container">
                                    <label htmlFor="moveInDate" className="form-label">Ngày vào:</label>
                                    <input
                                        type="date"
                                        name="moveInDate"
                                        placeholder="Ngày vào"
                                        value={newTenant.moveInDate}
                                        onChange={handleInputChange}
                                        className="form-control mb-2"
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="identityCardNumber"
                                    placeholder="Số CCCD"
                                    value={newTenant.identityCardNumber}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <div className="file-upload-container">
                                    <label htmlFor="frontImage" className="form-label">Mặt trước CCCD: </label>
                                    <input
                                        type="file"
                                        name="frontImage"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="file-upload-container">
                                    <label htmlFor="backImage" className="form-label">Mặt sau CCCD: </label>
                                    <input
                                        type="file"
                                        name="backImage"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <input
                                    type="number"
                                    name="temporaryResidenceStatus"
                                    placeholder="Tình trạng tạm trú"
                                    value={newTenant.temporaryResidenceStatus}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={toggleModal}>Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white card-box p0 border-20">
                <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                    {tenants && tenants.length > 0 && (
                        <>
                            <table className="table property-list-table">
                                <thead>
                                    <tr>
                                        <th>Ảnh đại diện</th>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Số điện thoại</th>
                                        <th>Phòng</th>
                                        <th>Ngày vào</th>
                                        <th>Ngày rời phòng</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th> {/* Cột mới cho nút Move Out */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.map((tenant) => (
                                        <tr key={tenant.id}>
                                            <td>
                                                <img
                                                    src={tenant.avatarUrl}
                                                    alt={tenant.fullName}
                                                    className="avatar-image"
                                                />
                                            </td>
                                            <td>{tenant.fullName}</td>

                                            <td>{tenant.email}</td>
                                            <td>{tenant.phone}</td>
                                            <td>{tenant.roomName}</td>
                                            <td>{tenant.moveInDate}</td>
                                            <td>{tenant.moveOutDate}</td>
                                            <td style={{ color: tenant.status === 'Đã rời phòng' ? 'red' : 'black' }}>
                                                {tenant.status}
                                            </td>
                                            <td>
                                                {tenant.status !== 'Đã rời phòng' && (
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleMoveOut(tenant.tenancyId, tenant.roomId)}
                                                    >
                                                        Chuyển ra
                                                    </button>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <nav aria-label="Page navigation" className={'d-flex justify-content-center'}>
                                <ul className="pagination">
                                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                        >
                                            &laquo;
                                        </button>
                                    </li>

                                    <li className="page-item">
                                        <span className="page-link">
                                            Trang {page}
                                        </span>
                                    </li>

                                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>

                        </>
                    )}
                </div>
            </div>

        </div>

    );
};

export default TenantManagement;
