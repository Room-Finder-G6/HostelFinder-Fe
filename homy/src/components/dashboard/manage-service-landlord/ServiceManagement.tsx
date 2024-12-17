import { useCallback, useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import Link from "next/link";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import HostelSelector from "../manage-room/HostelSelector";
import { toast } from "react-toastify";
import { Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import { FaSearch, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import DeleteModal from "@/modals/DeleteModal";

interface MeterReading {
   id: string;
   roomId: string;
   roomName: string;
   serviceId: string;
   serviceName: string;
   reading: number;
   billingMonth: number;
   billingYear: number;
}

interface PagedResponse {
   pageIndex: number;
   pageSize: number;
   totalPages: number;
   totalRecords: number;
   succeeded: boolean;
   message: string | null;
   errors: string[] | null;
   data: MeterReading[];
}

interface JwtPayload {
   UserId: string;
}

interface EditModalProps {
   show: boolean;
   onHide: () => void;
   meterReading: MeterReading | null;
   onSubmit: (id: string, reading: number) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({ show, onHide, meterReading, onSubmit }) => {
   const [reading, setReading] = useState<number>(meterReading?.reading || 0);
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      if (meterReading) {
         setReading(meterReading.reading);
      }
   }, [meterReading]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!meterReading) return;

      setIsSubmitting(true);
      try {
         await onSubmit(meterReading.id, reading);
         onHide();
      } catch (error) {
         console.error('Error submitting form:', error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Modal show={show} onHide={onHide} centered>
         <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa chỉ số</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <Form onSubmit={handleSubmit}>
               <Form.Group className="mb-3">
                  <Form.Label>Phòng</Form.Label>
                  <Form.Control type="text" value={meterReading?.roomName || ''} disabled />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label>Dịch vụ</Form.Label>
                  <Form.Control type="text" value={meterReading?.serviceName || ''} disabled />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label>Chỉ số mới</Form.Label>
                  <Form.Control
                     type="number"
                     value={reading}
                     onChange={(e) => setReading(Number(e.target.value))}
                     min={0}
                     required
                  />
               </Form.Group>
               <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={onHide}>
                     Hủy
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                     {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
               </div>
            </Form>
         </Modal.Body>
      </Modal>
   );
};

const MeterReadingBody = () => {
   // State Management
   const [selectedHostel, setSelectedHostel] = useState<string>('');
   const [meterReadings, setMeterReadings] = useState<MeterReading[]>([]);
   const [totalRecords, setTotalRecords] = useState<number>(0);
   const [pageIndex, setPageIndex] = useState<number>(1);
   const [pageSize, setPageSize] = useState<number>(10);
   const [totalPages, setTotalPages] = useState<number>(1);
   const [searchRoom, setSearchRoom] = useState<string>("");
   const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
   const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
   const [showEditModal, setShowEditModal] = useState(false);
   const [selectedMeterReading, setSelectedMeterReading] = useState<MeterReading | null>(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);

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

   const fetchMeterReadings = async () => {
      if (!selectedHostel) {
         setMeterReadings([]);
         return;
      }

      try {
         const formData = new FormData();
         formData.append('hostelId', selectedHostel);
         if (searchRoom) formData.append('roomName', searchRoom);
         if (selectedMonth) formData.append('month', selectedMonth.toString());
         if (selectedYear) formData.append('year', selectedYear.toString());

         const response = await apiInstance.post(
            `/meterReadings/paged?pageIndex=${pageIndex}&pageSize=${pageSize}`,
            formData
         );

         if (response.status === 200 && response.data.succeeded) {
            const data: PagedResponse = response.data;
            setMeterReadings(data.data);
            setTotalRecords(data.totalRecords);
            setTotalPages(data.totalPages);
         }
      } catch (error) {
         console.error("Error fetching meter readings:", error);
         toast.error("Có lỗi khi tải dữ liệu");
         setMeterReadings([]);
      }
   };

   useEffect(() => {
      fetchMeterReadings();
   }, [selectedHostel, pageIndex, pageSize, searchRoom, selectedMonth, selectedYear]);

   const handlePageChange = (newPageIndex: number) => {
      if (newPageIndex >= 1 && newPageIndex <= totalPages) {
         setPageIndex(newPageIndex);
      }
   };

   const handleHostelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedHostel(event.target.value);
      setPageIndex(1);
   };

   const handleEdit = (meterReading: MeterReading) => {
      setSelectedMeterReading(meterReading);
      setShowEditModal(true);
   };
   const handleDelete = (meterReading: MeterReading) => {
      setSelectedMeterReading(meterReading);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      if (!selectedMeterReading) return;

      try {
         const response = await apiInstance.delete(`/meterReadings/${selectedMeterReading.id}`);

         if (response.status === 200) {
            toast.success('Xóa chỉ số thành công');
            await fetchMeterReadings();
         }
      } catch (error) {
         console.error('Error deleting meter reading:', error);
         toast.error('Có lỗi xảy ra khi xóa chỉ số');
      } finally {
         setShowDeleteModal(false);
         setSelectedMeterReading(null);
      }
   };

   const handleEditSubmit = async (id: string, reading: number) => {
      try {
         const formData = new FormData();
         formData.append('reading', reading.toString());

         const response = await apiInstance.put(`/meterReadings/${id}`, formData);

         if (response.status === 200) {
            toast.success('Cập nhật chỉ số thành công');
            await fetchMeterReadings();
         }
      } catch (error: any) {
         console.error('Error updating meter reading:', error);
         toast.error(error.response.data.message);
      }
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Quản lý chỉ số điện nước" />
            <h2 className="main-title d-block d-lg-none">Quản lý chỉ số điện nước</h2>

            {/* Chọn nhà trọ */}
            <HostelSelector
               selectedHostel={selectedHostel}
               onHostelChange={handleHostelChange}
            />

            {/* Form tìm kiếm và lọc */}
            {selectedHostel && (
               <Card className="mb-4">
                  <Card.Body>
                     <div className="row g-3">
                        <div className="col-md-4">
                           <InputGroup>
                              <Form.Control
                                 type="text"
                                 placeholder="Tìm kiếm theo tên phòng"
                                 value={searchRoom}
                                 onChange={(e) => setSearchRoom(e.target.value)}
                              />
                              <Button variant="primary">
                                 <FaSearch />
                              </Button>
                           </InputGroup>
                        </div>
                        <div className="col-md-4">
                           <Form.Select
                              value={selectedMonth}
                              onChange={(e) => setSelectedMonth(Number(e.target.value))}
                           >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                 <option key={month} value={month}>
                                    Tháng {month}
                                 </option>
                              ))}
                           </Form.Select>
                        </div>
                        <div className="col-md-4">
                           <Form.Select
                              value={selectedYear}
                              onChange={(e) => setSelectedYear(Number(e.target.value))}
                           >
                              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                                 <option key={year} value={year}>
                                    Năm {year}
                                 </option>
                              ))}
                           </Form.Select>
                        </div>
                     </div>
                  </Card.Body>
               </Card>
            )}

            {/* Bảng dữ liệu */}
            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                  <table className="table saved-search-table">
                     <thead>
                        <tr>
                           <th scope="col">Tên phòng</th>
                           <th scope="col">Loại dịch vụ</th>
                           <th scope="col">Chỉ số</th>
                           <th scope="col">Tháng</th>
                           <th scope="col">Năm</th>
                           <th scope="col">Hành động</th>
                        </tr>
                     </thead>
                     <tbody className="border-0">
                        {meterReadings.map((reading) => (
                           <tr key={reading.id}>
                              <td>{reading.roomName}</td>
                              <td>{reading.serviceName}</td>
                              <td>{reading.reading}</td>
                              <td>{reading.billingMonth}</td>
                              <td>{reading.billingYear}</td>
                              <td>
                                 <div className="d-flex justify-content-end">
                                    <Button
                                       variant="outline-primary"
                                       size="sm"
                                       className="me-2"
                                       title="Sửa"
                                       onClick={() => handleEdit(reading)}
                                    >
                                       <FaPencilAlt className="me-1" /> Sửa
                                    </Button>
                                    <Button
                                       variant="outline-danger"
                                       size="sm"
                                       title="Xóa"
                                       onClick={() => handleDelete(reading)}
                                    >
                                       <FaTrashAlt className="me-1" /> Xóa
                                    </Button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Phân trang */}
            <ul className="pagination-one d-flex align-items-center style-none pt-40">
               <li className="me-3">
                  <Link
                     href="#"
                     onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageIndex - 1);
                     }}
                     className={pageIndex === 1 ? "disabled" : ""}
                  >
                     Trang trước
                  </Link>
               </li>

               {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={pageIndex === index + 1 ? "selected" : ""}>
                     <Link
                        href="#"
                        onClick={(e) => {
                           e.preventDefault();
                           handlePageChange(index + 1);
                        }}
                     >
                        {index + 1}
                     </Link>
                  </li>
               ))}

               <li className="ms-2">
                  <Link
                     href="#"
                     onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageIndex + 1);
                     }}
                     className={pageIndex === totalPages ? "disabled" : ""}
                  >
                     Trang sau <Image src={icon_1} alt="" className="ms-2" />
                  </Link>
               </li>
            </ul>

            {/* Edit Modal */}
            <EditModal
               show={showEditModal}
               onHide={() => {
                  setShowEditModal(false);
                  setSelectedMeterReading(null);
               }}
               meterReading={selectedMeterReading}
               onSubmit={handleEditSubmit}
            />
            <DeleteModal
               show={showDeleteModal}
               title="Xóa số liệu"
               message={`Bạn có chắc chắn muốn xóa chỉ số ${selectedMeterReading?.serviceName?.toLowerCase()} của ${selectedMeterReading?.roomName} không?`}
               onConfirm={handleDeleteConfirm}
               onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedMeterReading(null);
               }}
            />
         </div>
      </div>
   );
};

export default MeterReadingBody;