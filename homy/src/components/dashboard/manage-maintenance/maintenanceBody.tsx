// components/MainTenanceBody.tsx
import { useCallback, useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import Link from "next/link";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import apiInstance from "@/utils/apiInstance";
import HostelSelector from "../manage-room/HostelSelector";
import { toast } from "react-toastify";
import { Button, ButtonGroup, ButtonToolbar, Form, Modal, Table, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdEmail } from 'react-icons/md';
import { MaintenanceRecord, PagedResponse, SortDirection } from "@/models/maintenanceRecord";
import { jwtDecode } from "jwt-decode";
import MaintenanceModal from "./Add/MaintenanceModal";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Loading from "@/components/Loading";
import EditMaintenanceModal from "@/components/dashboard/manage-maintenance/Edit/EditMaintenanceModal";

interface JwtPayload {
    UserId: string;
}

const MainTenanceBody = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
    const [hostels, setHostels] = useState<{ id: string; hostelName: string }[]>([]);
    const [selectedHostel, setSelectedHostel] = useState<string>('');
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRecord, setEditRecord] = useState<MaintenanceRecord | null>(null);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    // Lấy UserId từ token JWT
    const getUserIdFromToken = useCallback((): string | null => {
        const token = window.localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
                return decodedToken.UserId;
            } catch (error) {
                console.error("Error decoding token:", error);
                return null;
            }
        }
        return null;
    }, []);

    // Lấy danh sách nhà trọ của chủ nhà
    const fetchHostels = async () => {
        const landlordId = getUserIdFromToken();
        if (!landlordId) {
            setError("Không thể lấy ID chủ nhà từ token.");
            return;
        }

        try {
            const response = await apiInstance.get(`/hostels/GetHostelsByLandlordId/${landlordId}`);
            if (response.data.succeeded && response.status === 200) {
                setHostels(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedHostel(response.data.data[0].id); // Chọn nhà trọ đầu tiên mặc định
                }
            } else {
                setError(response.data.message || "Không thể lấy danh sách nhà trọ.");
            }
        } catch (err) {
            console.error("Error fetching hostels:", err);
            setError("Lỗi khi lấy danh sách nhà trọ.");
        }
    };

    // Lấy danh sách maintenance records từ API
    const fetchMaintenanceRecords = async () => {
        if (!selectedHostel) {
            setMaintenanceRecords([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiInstance.get<PagedResponse<MaintenanceRecord>>(
                `/maintenance-record`,
                {
                    params: {
                        HostelId: selectedHostel,
                        SearchPhrase: searchPhrase,
                        PageNumber: pageIndex,
                        PageSize: pageSize,
                        SortBy: null, // Bạn có thể thêm tính năng sắp xếp sau
                        SortDirection: SortDirection.Ascending,
                    },
                }
            );

            if (response.data.succeeded && response.status === 200) {
                setMaintenanceRecords(response.data.data);
                setTotalRecords(response.data.totalRecords);
                setTotalPages(response.data.totalPages);
            } else {
                setError(response.data.message || "Không thể lấy danh sách maintenance records.");
            }
        } catch (err) {
            console.error("Error fetching maintenance records:", err);
            setError("Lỗi khi lấy danh sách maintenance records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    useEffect(() => {
        if (selectedHostel) {
            fetchMaintenanceRecords();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHostel, pageIndex, pageSize, searchPhrase]);

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex >= 1 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchPhrase(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setPageIndex(1); // Reset về trang đầu khi tìm kiếm
        fetchMaintenanceRecords();
    };

    const handleHostelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedHostel(event.target.value);
        setPageIndex(1); // Reset lại trang khi thay đổi nhà trọ
    };


    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleSuccess = () => {
        // You can handle any post-submit logic here (like fetching new data)
    };

    const reloadTable = () => {
        fetchMaintenanceRecords();
    };

    const maintenanceTypeOptions = [
        { label: 'Sửa điện', value: 0 },
        { label: 'Sửa ống nước', value: 1 },
        { label: 'Sửa tường', value: 2 },
        { label: 'Sửa chữa chung', value: 3 },
        { label: 'Khác', value: 4 }
    ];

    const getMaintenanceTypeLabel = (maintenanceType: number) => {
        const option = maintenanceTypeOptions.find(option => option.value === maintenanceType);
        return option ? option.label : 'Không xác định';
    };

    const handleEditClick = (recordId: string) => {
        setSelectedRecordId(recordId);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setSelectedRecordId(null);
        setShowEditModal(false);
    };


    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Quản lí sửa chữa" />
                <h2 className="main-title d-block d-lg-none">Quản lí sửa chữa, bảo dưỡng</h2>

                {/* Chọn nhà trọ */}
                <HostelSelector
                    selectedHostel={selectedHostel}
                    onHostelChange={handleHostelChange}
                />

                {/* Form tìm kiếm */}
                {selectedHostel && (
                    <div className="search-form ms-auto">
                        <form onSubmit={handleSearchSubmit} className="d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control search-input me-2"
                                placeholder="Tìm kiếm theo tiêu đề hoặc mô tả"
                                value={searchPhrase}
                                onChange={handleSearchChange}
                            />
                            <button type="submit" className="btn btn-primary">
                                <Image src={dashboardIcon_1} alt="search-icon" className="lazy-img" />
                            </button>
                        </form>
                    </div>
                )}

                {/* Hiển thị thông báo lỗi nếu có */}
                {error && <div className="alert alert-danger">{error}</div>}

                <Button variant="btn btn-success btn-sm d-flex align-items-center" onClick={handleShowModal}>
                    <div
                        className="d-flex align-items-center justify-content-center me-2 bg-light rounded"
                        style={{ width: '24px', height: '24px', color: 'green' }}
                    >
                        <FaPlus size={14} />
                    </div>
                    Thêm mới
                </Button>
                {/* Bảng hiển thị Maintenance Records */}
                <div className="bg-white card-box p-0 border-20">
                    <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                        {loading ? (
                            <Loading/>
                        ) : (
                            <Table className="saved-search-table" hover={false}>
                                <thead>
                                    <tr>
                                        <th scope="col">Tên phòng</th>
                                        <th scope="col">Tiêu đề</th>
                                        <th scope="col">Mô tả</th>
                                        <th scope="col">Ngày bảo trì</th>
                                        <th scope="col">Số tiền</th>
                                        <th scope="col">Loại</th>
                                        <th scope="col" className="text-end">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {maintenanceRecords.length > 0 ? (
                                        maintenanceRecords.map((record) => (
                                            <tr key={record.hostelId + record.maintenanceDate}>
                                                <td>
                                                    <span className="color-dark fw-500">
                                                        {record.roomName || "N/A"}
                                                    </span>
                                                </td>
                                                <td>{record.title}</td>
                                                <td>{record.description || "N/A"}</td>
                                                <td>{new Date(record.maintenanceDate).toLocaleDateString()}</td>
                                                <td>{record.cost.toLocaleString('vi-VN')} ₫</td>
                                                <td>{getMaintenanceTypeLabel(record.maintenanceType)}</td>

                                                <td>
                                                    <div className="d-flex justify-content-end btns-group">
                                                        <ButtonToolbar className="ms-3" onClick={() => handleEditClick(record.id)} data-bs-toggle="tooltip" title="Chỉnh sửa">
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </ButtonToolbar>

                                                        <ButtonToolbar className="ms-3" data-bs-toggle="tooltip" title="Xóa">
                                                            <i className="fa-regular fa-trash"></i>
                                                        </ButtonToolbar>
                                                    </div>
                                                </td>
                                            </tr>

                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="table-empty-state">
                                                Không có bản ghi bảo trì
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </div>

                {/* MaintenanceModal component */}
                <MaintenanceModal
                    show={showModal}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                    selectedHostel={selectedHostel}
                    reloadTable={reloadTable}
                />

                <EditMaintenanceModal
                    show={showEditModal}
                    onClose={handleCloseEditModal}
                    onSuccess={() => {
                        handleCloseEditModal();
                        reloadTable();
                    }}
                    selectedHostel={selectedHostel}
                    reloadTable={reloadTable}
                    recordId={selectedRecordId}
                />

                {/* Phân trang với thiết kế mới */}
                {totalPages > 1 && (
                    <ul style={{ marginLeft: "15px" }} className="pagination-one d-flex align-items-center style-none pt-40">
                        <li className="me-3">
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(pageIndex - 1);
                                }}
                                className={pageIndex === 1 ? "disabled" : ""}
                            >
                                Trang đầu
                            </Link>
                        </li>

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <li key={page} className={pageIndex === page ? "selected" : ""}>
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(page);
                                        }}
                                    >
                                        {page}
                                    </Link>
                                </li>
                            );
                        })}

                        <li className="ms-2">
                            <Link
                                href="#"
                                className="d-flex align-items-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(totalPages);
                                }}
                            >
                                Trang cuối <Image src={icon_1} alt="" className="ms-2" />
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </div >
    );
};

export default MainTenanceBody;
