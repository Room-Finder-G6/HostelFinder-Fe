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
    status: string;
    province:string;
    district:string;
    commune:string;
    detailAddress:string;
    identityCardNumber:string;
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
    const fetchTenants = async (hostelId: string, page: number, searchQuery: string) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(
                `/Tenants/GetAllTenantsByHostel/${hostelId}?pageNumber=${page}&pageSize=10`
            );
            if (response.data.succeeded) {
                const filteredTenants = response.data.data.map((tenant: any) => {
                    // Kiểm tra MoveOutDate để xác định trạng thái
                    const status = tenant.MoveOutDate 
                        ? (new Date(tenant.MoveOutDate) < new Date() ? "Đã rời phòng" : "Đang thuê")
                        : "Đang thuê"; // Nếu không có MoveOutDate, luôn là "Đang thuê"
                    
                    return {
                        ...tenant,
                        Status: status, // Cập nhật trạng thái
                    };
                });
    
                setTenants(filteredTenants);
    
                // Tính toán số trang nếu có
                const totalRecords = response.data.totalRecords;
                setTotalPages(Math.ceil(totalRecords / 10));
            } else {
                const errorMessage = response.data.message || "Không thể tải danh sách tenants.";
                toast.error(errorMessage);
                setTenants([]); // Fallback to an empty array
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
            setTenants([]); // Fallback to an empty array
        }
        setLoading(false);
    };
    
    
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
        // Kiểm tra nếu trang sau có hợp lệ hay không
        if (newPage > totalPages || newPage < 1) return;
        setPage(newPage);
        fetchTenants(selectedHostelId, newPage, searchQuery);
    };

    // Hàm tìm kiếm phòng trọ theo tên
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        fetchTenants(selectedHostelId, 1, e.target.value); // Tìm kiếm khi thay đổi từ khóa
    };


    // Hàm xử lý thay đổi nhà trọ
    const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const hostelId = e.target.value;
        setSelectedHostelId(hostelId);
        setPage(1); // Reset trang về 1
        setTenants([]); // Reset tenants khi thay đổi hostel
        fetchRooms(hostelId); // Lấy phòng của hostel đã chọn
        fetchTenants(hostelId, 1, searchQuery); // Lấy tenants của hostel đã chọn
    };
    const handleMoveOut = async (tenantId: string, roomId: string) => {
        setLoading(true);
        try {
            // Gửi yêu cầu MoveOut đến API
            const response = await apiInstance.post(`/Tenants/moveout?tenantId=${tenantId}&roomId=${roomId}`);

            if (response.data.succeeded) {
                // Sau khi move out thành công, làm mới trang
                toast.success("Thành viên đã chuyển ra khỏi phòng thành công.");
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
                fetchTenants(selectedHostelId, page, searchQuery); // Lấy lại danh sách tenants
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
            fetchRooms(selectedHostelId);
            fetchTenants(selectedHostelId, page, searchQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHostelId, page, searchQuery]); // Chú ý kiểm tra các dependency


    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="Quản lý người thuê" />

            <div className="d-flex align-items-center gap-4 mb-4">
                <RoomSelector
                    selectedHostel={selectedHostelId}
                    onHostelChange={handleHostelChange}
                    selectedRoom={""} // Không cần chọn phòng
                    onRoomChange={() => { }} // Không cần xử lý khi thay đổi phòng
                />
            </div>
            {loading &&
                <Loading />

                // <div>
                //     {renderTenants()}
                // </div>
            }
            {/* Tìm kiếm theo tên phòng trọ */}
            <input
                type="text"
                name="room"
                placeholder="Tìm kiếm phòng"
                value={searchQuery}
                onChange={handleSearchChange}  // Xử lý tìm kiếm khi người dùng nhập
                className="form-control mb-2"
                required
            />
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
                                {/* Form input để thêm thành viên */}
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
                                <input
                                    type="file"
                                    name="avatarImage"
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
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
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={newTenant.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="date"
                                    name="moveInDate"
                                    value={newTenant.moveInDate}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                {/* <input
                                    type="text"
                                    name="province"
                                    placeholder="Tỉnh"
                                    value={newTenant.province}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="district"
                                    placeholder="Quận/Huyện"
                                    value={newTenant.district}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="commune"
                                    placeholder="Xã/Phường"
                                    value={newTenant.commune}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="detailAddress"
                                    placeholder="Địa chỉ cụ thể"
                                    value={newTenant.detailAddress}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                /> */}
                                <input
                                    type="text"
                                    name="identityCardNumber"
                                    placeholder="Số CCCD"
                                    value={newTenant.identityCardNumber}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="file"
                                    name="frontImage"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="file"
                                    name="backImage"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                />


                                <input
                                    type="number"
                                    name="temporaryResidenceStatus"
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
                                            <td style={{ color: tenant.status === 'Đã rời phòng' ? 'red' : 'black' }}>
                                                {tenant.status}
                                            </td>

                                            <td>
                                                {/* Kiểm tra nếu trạng thái là "Đã chuyển ra" thì ẩn nút */}

                                                <button
                                                    className="btn btn-danger"
                                                    // onClick={() => handleMoveOut(tenant.tenancyId, tenant.roomId)}
                                                >
                                                    Chuyển ra
                                                </button>

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
