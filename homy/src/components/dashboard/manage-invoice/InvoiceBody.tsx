import { useCallback, useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import Link from "next/link";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import './css/invoice.css';
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import HostelSelector from "../manage-room/HostelSelector";
import { toast } from "react-toastify";
import { Button, ButtonGroup, ButtonToolbar, Form, Modal, Table, Spinner, Badge } from "react-bootstrap";
import { MdEmail } from 'react-icons/md';
import Loading from "@/components/Loading";
import { FaEye, FaFileInvoiceDollar, FaTrashAlt } from "react-icons/fa";

interface Invoice {
   id: string;
   roomName: string;
   billingMonth: number;
   billingYear: number;
   totalAmount: number;
   isPaid: boolean;
}

interface Hostel {
   id: string;
   hostelName: string;
}

interface PagedResponse {
   pageIndex: number;
   pageSize: number;
   totalPages: number;
   totalRecords: number;
   data: Invoice[];
}

interface JwtPayload {
   UserId: string;
}

const InvoiceBody = () => {
   const [hostels, setHostels] = useState<Hostel[]>([]);
   const [selectedHostel, setSelectedHostel] = useState<string>('');
   const [invoices, setInvoices] = useState<Invoice[]>([]);
   const [totalRecords, setTotalRecords] = useState<number>(0);
   const [pageIndex, setPageIndex] = useState<number>(1);
   const [pageSize, setPageSize] = useState<number>(10);
   const [totalPages, setTotalPages] = useState<number>(1);
   const [searchPhrase, setSearchPhrase] = useState<string>("");
   const [showModal, setShowModal] = useState(false);
   const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
   const [showCollectMoneyModal, setShowCollectMoneyModal] = useState(false);
   const [amountPaid, setAmountPaid] = useState<number>(0);
   const [formOfTransfer, setFormOfTransfer] = useState<string>("");
   const [dateOfSubmit, setDateOfSubmit] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);

   // State mới cho việc gửi email
   const [sendingEmail, setSendingEmail] = useState(false);
   const [emailMessage, setEmailMessage] = useState(null);
   const [emailError, setEmailError] = useState(null);

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

   const fetchHostels = async () => {
      const landlordId = getUserIdFromToken();
      const response = await apiInstance.get(`/hostels/GetHostelsByLandlordId/${landlordId}`);
      if (response.data.succeeded && response.status === 200) {
         setHostels(response.data);
      }
   };

   const fetchInvoices = async () => {
      if (!selectedHostel) {
         setInvoices([]);
         return;
      }

      try {
         const response = await apiInstance.get(
            `/invoices/getInvoicesByHostelId?hostelId=${selectedHostel}&searchPhrase=${searchPhrase}&pageNumber=${pageIndex}&pageSize=${pageSize}`
         );
         if (response.status === 200 && response.data.succeeded) {
            const data: PagedResponse = await response.data;
            setInvoices(data.data);
            setTotalRecords(data.totalRecords);
            setTotalPages(data.totalPages);
         }
      } catch (error) {
         console.error("Error fetching invoices:", error);
         setInvoices([]);
      }
   };


   useEffect(() => {
      fetchHostels();
   }, []);

   useEffect(() => {
      fetchInvoices();
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
      fetchInvoices();
   };

   const handleHostelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedHostel(event.target.value);
      setPageIndex(1); // Reset lại trang khi thay đổi nhà trọ
   };

   const fetchInvoiceDetails = async (invoiceId: string) => {
      try {
         const response = await apiInstance.get(`/invoices/detail?invoiceId=${invoiceId}`);
         if (response.data.succeeded) {
            setInvoiceDetails(response.data.data);
            setAmountPaid(response.data.data.totalAmount);
            setDateOfSubmit(new Date().toISOString().split("T")[0]);  // Set dữ liệu hóa đơn chi tiết
            if (response.data.data.isPaid === true) {
               setShowModal(true);
            }
            else {
               setShowCollectMoneyModal(true);
            }
         }
      } catch (error) {
         console.error("Error fetching invoice details:", error);
         toast.error("Không thể tải chi tiết hóa đơn.");
      }
   };

   const handleViewClick = (invoiceId: string) => {
      fetchInvoiceDetails(invoiceId);
   };

   const handlePaymentSubmit = async () => {
      if (amountPaid <= 0 || !formOfTransfer || !dateOfSubmit) {
         toast.warning("Vui lòng nhập đủ thông tin thanh toán");
         return;
      }

      setLoading(true);
      try {
         const response = await apiInstance.post("/invoices/collect-money", {
            invoiceId: invoiceDetails.id,
            amountPaid,
            formOfTransfer,
            dateOfSubmit, // Gửi ngày thanh toán
         });

         if (response.data.succeeded && response.status === 200) {
            toast.success(response.data.message);
            fetchInvoices();
            fetchInvoiceDetails(invoiceDetails.id);
            setShowCollectMoneyModal(false);
            setShowModal(false);
         } else {
            toast.error(response.data.message || "Thanh toán thất bại");
         }
      } catch (error) {
         toast.error("Đã có lỗi xảy ra khi thanh toán");
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   // Hàm xử lý gửi email
   const handleSendEmail = async () => {
      setSendingEmail(true);
      setEmailMessage(null);
      setEmailError(null);
      try {
         const response = await apiInstance.post(`/invoices/send-email`, null, {
            params: { invoiceId: invoiceDetails.id },
         });

         if (response.data.succeeded) {
            setEmailMessage(response.data.message || "Gửi email thành công!");
         } else {
            setEmailError(response.data.message || "Gửi email thất bại!");
         }
      } catch (error: any) {
         setEmailError(error.response?.data?.message || "Gửi email thất bại do lỗi máy chủ.");
      }
      setSendingEmail(false);
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Quản lí hóa đơn" />
            <h2 className="main-title d-block d-lg-none">Quản lí hóa đơn</h2>

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
                        placeholder="Tìm kiếm theo tên phòng"
                        value={searchPhrase}
                        onChange={handleSearchChange}
                     />
                     <button type="submit" className="btn btn-primary">
                        <Image src={dashboardIcon_1} alt="search-icon" className="lazy-img" />
                     </button>
                  </form>
               </div>
            )}

            <div className="invoice-container">
               <div className="table-responsive">
                  <table className="invoice-table">
                     <thead>
                        <tr>
                           <th>Tên phòng</th>
                           <th>Thời gian</th>
                           <th>Số tiền</th>
                           <th>Trạng thái</th>
                           <th className="text-end">Hành động</th>
                        </tr>
                     </thead>
                     <tbody>
                        {invoices.map((invoice) => (
                           <tr key={invoice.id} className="invoice-row">
                              <td>
                                 <div className="room-info">
                                    <div className="icon-wrapper">
                                       <FaFileInvoiceDollar className="text-primary" />
                                    </div>
                                    <div className="room-details">
                                       <Link
                                          href="#"
                                          className="room-name"
                                       >
                                          {invoice.roomName}
                                       </Link>
                                       <small className="invoice-id text-muted">
                                          #{invoice.id}
                                       </small>
                                    </div>
                                 </div>
                              </td>
                              <td>
                                 <div className="date-info">
                                    <div className="month-year">
                                       Tháng {invoice.billingMonth}/{invoice.billingYear}
                                    </div>
                                 </div>
                              </td>
                              <td>
                                 <div className="amount">
                                    {invoice.totalAmount.toLocaleString('vi-VN')} ₫
                                 </div>
                              </td>
                              <td>
                                 <div className={`status-badge ${invoice.isPaid ? 'paid' : 'unpaid'}`}>
                                    <span className="status-dot"></span>
                                    {invoice.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                 </div>
                              </td>
                              <td>
                                 <div className="action-buttons">
                                    <button
                                       className="btn btn-icon btn-light"
                                       onClick={() => handleViewClick(invoice.id)}
                                       title="Xem chi tiết"
                                    >
                                       <FaEye className="text-primary" />
                                    </button>
                                    <button
                                       className="btn btn-icon btn-light ms-2"
                                       title="Xóa hóa đơn"
                                    >
                                       <FaTrashAlt className="text-danger" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <Modal
               show={showCollectMoneyModal}
               onHide={() => setShowCollectMoneyModal(false)}
               size="xl"
               centered
               className="custom-invoice-modal"
            >
               <Modal.Header closeButton className="bg-light">
                  <Modal.Title className="w-100 text-center fw-bold text-primary">
                     Chi Tiết Hóa Đơn Và Thanh Toán
                  </Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div className="row g-4">
                     {/* Phần Thông Tin Hóa Đơn */}
                     <div className="col-md-7">
                        <div className="card shadow-sm mb-4">
                           <div className="card-header bg-soft-primary">
                              <h5 className="card-title mb-0">Thông Tin Hóa Đơn</h5>
                           </div>
                           <div className="card-body">
                              {invoiceDetails ? (
                                 <>
                                    <div className="row mb-3">
                                       <div className="col-6">
                                          <p className="mb-2">
                                             <strong>Tháng/Năm:</strong>
                                             {invoiceDetails.billingMonth}/{invoiceDetails.billingYear}
                                          </p>
                                          <p>
                                             <strong>Tổng Tiền:</strong>{' '}
                                             <span className="text-primary fw-bold">
                                                {new Intl.NumberFormat('vi-VN').format(invoiceDetails.totalAmount)} đ
                                             </span>
                                          </p>
                                       </div>
                                       <div className="col-6 text-end">
                                          <span className={`badge fs-6 ${invoiceDetails.isPaid ? "bg-success" : "bg-danger"}`}>
                                             {invoiceDetails.isPaid ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
                                          </span>
                                       </div>
                                    </div>

                                    <Button
                                       onClick={handleSendEmail}
                                       disabled={sendingEmail}
                                       variant="outline-primary"
                                       className="d-flex align-items-center"
                                    >
                                       {sendingEmail ? (
                                          <>
                                             <Spinner animation="border" size="sm" className="me-2" />
                                             Đang Gửi Email...
                                          </>
                                       ) : (
                                          <>
                                             <MdEmail className="me-2" />
                                             Gửi Email Thông Báo
                                          </>
                                       )}
                                    </Button>

                                    <div className="table-responsive mt-3">
                                       <Table striped hover className="text-nowrap">
                                          <thead className="table-light">
                                             <tr>
                                                <th>Dịch Vụ</th>
                                                <th className="text-end">Đơn Giá</th>
                                                <th className="text-end">Chi Phí Thực Tế</th>
                                                <th className="text-center">SL Khách</th>
                                                <th className="text-center">Chỉ Số Trước</th>
                                                <th className="text-center">Chỉ Số Hiện Tại</th>
                                                <th className="text-center">Ngày Lập</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {invoiceDetails.invoiceDetails.map((detail: any, index: number) => (
                                                <tr key={index}>
                                                   <td>{detail.serviceName}</td>
                                                   <td className="text-end">{new Intl.NumberFormat('vi-VN').format(detail.unitCost)} đ</td>
                                                   <td className="text-end">{new Intl.NumberFormat('vi-VN').format(detail.actualCost)} đ</td>
                                                   <td className="text-center">{detail.numberOfCustomer}</td>
                                                   <td className="text-center">{detail.previousReading || 'N/A'}</td>
                                                   <td className="text-center">{detail.currentReading || 'N/A'}</td>
                                                   <td className="text-center">{new Date(detail.billingDate).toLocaleDateString()}</td>
                                                </tr>
                                             ))}
                                          </tbody>
                                       </Table>
                                    </div>
                                 </>
                              ) : (
                                 <Loading />
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Phần Thanh Toán */}
                     <div className="col-md-5">
                        <div className="card shadow-sm">
                           <div className="card-header bg-soft-primary">
                              <h5 className="card-title mb-0">Thanh Toán Hóa Đơn</h5>
                           </div>
                           <div className="card-body">
                              <Form>
                                 <Form.Group className="mb-3" controlId="amountPaid">
                                    <Form.Label>Số Tiền Thanh Toán</Form.Label>
                                    <Form.Control
                                       type="text"
                                       value={amountPaid.toLocaleString('vi-VN')}
                                       onChange={(e) => {
                                          const value = e.target.value.replace(/[^\d]/g, '');
                                          setAmountPaid(value ? Number(value) : 0);
                                       }}
                                       placeholder="Nhập số tiền"
                                    />
                                 </Form.Group>

                                 <Form.Group className="mb-3" controlId="formOfTransfer">
                                    <Form.Label>Hình Thức Thanh Toán</Form.Label>
                                    <Form.Select
                                       value={formOfTransfer}
                                       onChange={(e) => setFormOfTransfer(e.target.value)}
                                    >
                                       <option value="">Chọn hình thức</option>
                                       <option value="Tiền mặt">Tiền mặt</option>
                                       <option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng</option>
                                       <option value="Thanh toán online">Thanh toán online</option>
                                    </Form.Select>
                                 </Form.Group>

                                 <Form.Group controlId="dateOfSubmit">
                                    <Form.Label>Ngày Thanh Toán</Form.Label>
                                    <Form.Control
                                       type="date"
                                       value={dateOfSubmit}
                                       onChange={(e) => setDateOfSubmit(e.target.value)}
                                    />
                                 </Form.Group>
                              </Form>
                           </div>
                        </div>
                     </div>
                  </div>
               </Modal.Body>
               <Modal.Footer className="bg-light">
                  <Button
                     variant="primary"
                     onClick={handlePaymentSubmit}
                     disabled={loading}
                     className="w-100"
                  >
                     {loading ? "Đang Thanh Toán..." : "Xác Nhận Thanh Toán"}
                  </Button>
               </Modal.Footer>
            </Modal>

            {/* Hóa đơn thành công */}
            <Modal
               show={showModal}
               onHide={() => setShowModal(false)}
               size="lg"
               centered
               className="invoice-details-modal"
               dialogClassName="modal-90w"
               fullscreen="lg-down"
            >
               <Modal.Header closeButton className="bg-primary text-white">
                  <Modal.Title className="w-100 text-center">Chi Tiết Hóa Đơn</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  {invoiceDetails ? (
                     <div className="invoice-details-container">
                        {/* Thông Tin Hóa Đơn */}
                        <section className="invoice-info mb-4">
                           <h5 className="mb-3 text-primary">Thông Tin Hóa Đơn</h5>
                           <div className="row">
                              <div className="col-md-6 mb-2">
                                 <p>
                                    <strong>Tháng/Năm:</strong> {invoiceDetails.billingMonth}/{invoiceDetails.billingYear}
                                 </p>
                                 <p>
                                    <strong>Tổng Tiền:</strong>{' '}
                                    <span className="text-success fw-bold">
                                       {new Intl.NumberFormat('vi-VN').format(invoiceDetails.totalAmount)} đ
                                    </span>
                                 </p>
                              </div>
                              <div className="col-md-6 mb-2 text-md-end">
                                 <strong>Trạng Thái:</strong>{' '}
                                 <Badge bg={invoiceDetails.isPaid ? 'success' : 'danger'}>
                                    {invoiceDetails.isPaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                                 </Badge>
                              </div>
                           </div>
                           <div className="row mt-3">
                              <div className="col-md-6 mb-2">
                                 <p>
                                    <strong>Hình Thức Chuyển Khoản:</strong> {invoiceDetails.formOfTransfer || 'N/A'}
                                 </p>
                                 <p>
                                    <strong>Số Tiền Đã Thu:</strong>{' '}
                                    {new Intl.NumberFormat('vi-VN').format(invoiceDetails.amountPaid)} đ
                                 </p>
                              </div>
                           </div>
                           <div className="d-flex justify-content-end mt-3">
                              <Button
                                 onClick={handleSendEmail}
                                 disabled={sendingEmail}
                                 variant="outline-light"
                                 className="d-flex align-items-center"
                              >
                                 {sendingEmail ? (
                                    <>
                                       <Spinner animation="border" size="sm" className="me-2" />
                                       Đang Gửi Email...
                                    </>
                                 ) : (
                                    <>
                                       <MdEmail className="me-2" />
                                       Gửi Email Thông Báo
                                    </>
                                 )}
                              </Button>
                           </div>
                        </section>

                        {/* Chi Tiết Dịch Vụ Hóa Đơn */}
                        <section className="invoice-services">
                           <h5 className="mb-3 text-primary">Chi Tiết Dịch Vụ</h5>
                           <div className="table-responsive">
                              <Table striped bordered hover className="text-nowrap">
                                 <thead className="table-secondary">
                                    <tr>
                                       <th>Dịch Vụ</th>
                                       <th className="text-end">Đơn Giá</th>
                                       <th className="text-end">Chi Phí Thực Tế</th>
                                       <th className="text-center">Số Lượng Khách</th>
                                       <th className="text-center">Chỉ Số Trước</th>
                                       <th className="text-center">Chỉ Số Sau</th>
                                       <th className="text-center">Ngày Lập</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {invoiceDetails.invoiceDetails.map((detail: any, index: number) => (
                                       <tr key={index}>
                                          <td>{detail.serviceName}</td>
                                          <td className="text-end">{new Intl.NumberFormat('vi-VN').format(detail.unitCost)} đ</td>
                                          <td className="text-end">{new Intl.NumberFormat('vi-VN').format(detail.actualCost)} đ</td>
                                          <td className="text-center">{detail.numberOfCustomer}</td>
                                          <td className="text-center">{detail.previousReading !== null ? detail.previousReading : 'N/A'}</td>
                                          <td className="text-center">{detail.currentReading !== null ? detail.currentReading : 'N/A'}</td>
                                          <td className="text-center">
                                             {new Date(detail.billingDate).toLocaleDateString('vi-VN')}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </Table>
                           </div>
                        </section>
                     </div>
                  ) : (
                     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                        <Loading />
                     </div>
                  )}
               </Modal.Body>
               <Modal.Footer className="bg-light">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                     Đóng
                  </Button>
               </Modal.Footer>
            </Modal>

            {/* Phân trang với thiết kế mới */}
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
                     Trang trước
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

               {totalPages > 5 && <li>....</li>}

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
         </div>
      </div>
   );
};

export default InvoiceBody;
