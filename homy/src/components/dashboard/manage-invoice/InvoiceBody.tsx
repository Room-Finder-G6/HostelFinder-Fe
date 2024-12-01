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
import { Button, ButtonGroup, ButtonToolbar, Form, Modal, Table } from "react-bootstrap";

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

         if (response.data.succeeded) {
            toast.success(response.data.message);
            setShowModal(false);  // Đóng modal
            fetchInvoices();
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

            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                  <table className="table saved-search-table">
                     <thead>
                        <tr>
                           <th scope="col">Mã hóa đơn</th>
                           <th scope="col">Tên phòng</th>
                           <th scope="col">Thời gian</th>
                           <th scope="col">Số tiền</th>
                           <th scope="col">Trạng thái</th>
                           <th scope="col">Hành động</th>
                        </tr>
                     </thead>
                     <tbody className="border-0">
                        {invoices.map((invoice) => (
                           <tr key={invoice.id}>
                              <td>{invoice.id}</td>
                              <td>
                                 <Link href="#" className="property-name tran3s color-dark fw-500">
                                    {invoice.roomName}
                                 </Link>
                              </td>
                              <td>
                                 {invoice.billingMonth}/{invoice.billingYear}
                              </td>
                              <td>{invoice.totalAmount.toLocaleString('vi-VN')} ₫</td>
                              <td>
                                 <span className={invoice.isPaid ? "badge bg-success" : "badge bg-danger"}>
                                    {invoice.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                 </span>
                              </td>
                              <td>
                                 <div className="d-flex justify-content-end btns-group">
                                    <ButtonToolbar onClick={() => handleViewClick(invoice.id)}>
                                       <i className="fa-sharp fa-regular fa-eye" data-bs-toggle="tooltip" title="Xem"></i>
                                    </ButtonToolbar>
                                    <ButtonToolbar className="ms-5" data-bs-toggle="tooltip" title="Delete">
                                       <i className="fa-regular fa-trash"></i>
                                    </ButtonToolbar>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Modal Thanh toán */}
            <Modal show={showCollectMoneyModal} onHide={() => setShowCollectMoneyModal(false)} size="lg">
               <Modal.Header closeButton>
                  <Modal.Title>Chi tiết hóa đơn</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div className="modal-content-row">
                     {/* Phần chi tiết hóa đơn */}
                     <div className="invoice-details">
                        {invoiceDetails ? (
                           <div>
                              <h5>Thông tin hóa đơn</h5>
                              <p><strong>Mã hóa đơn:</strong> {invoiceDetails.id}</p>
                              <p><strong>Tháng/Năm:</strong> {invoiceDetails.billingMonth}/{invoiceDetails.billingYear}</p>
                              <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN').format(invoiceDetails.totalAmount)} đ</p>
                              <p><strong>Trạng thái:</strong>
                                 <span className={`badge ${invoiceDetails.isPaid ? "bg-success" : "bg-danger"}`}>
                                    {invoiceDetails.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                 </span>
                              </p>

                              {/* Chi tiết dịch vụ hóa đơn */}
                              <Table striped bordered hover>
                                 <thead>
                                    <tr>
                                       <th>Dịch vụ</th>
                                       <th>Đơn giá</th>
                                       <th>Chi phí thực tế</th>
                                       <th>Số lượng khách</th>
                                       <th>Chỉ số trước</th>
                                       <th>Chỉ số hiện tại</th>
                                       <th>Ngày lập</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {invoiceDetails.invoiceDetails.map((detail: any, index: number) => (
                                       <tr key={index}>
                                          <td>{detail.serviceName}</td>
                                          <td className="text-center">{new Intl.NumberFormat('vi-VN').format(detail.unitCost)} đ</td>
                                          <td className="text-center">{new Intl.NumberFormat('vi-VN').format(detail.actualCost)} đ</td>
                                          <td className="text-center">{detail.numberOfCustomer}</td>
                                          <td className="text-center">{detail.previousReading === 0 ? 'N/A' : detail.previousReading}</td>
                                          <td className="text-center">{detail.currentReading === 0 ? 'N/A' : detail.currentReading}</td>
                                          <td className="text-center">{new Date(detail.billingDate).toLocaleDateString()}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </Table>
                           </div>
                        ) : (
                           <p>Đang tải thông tin chi tiết...</p>
                        )}
                     </div>

                     {/* Phần Thanh toán */}
                     <div className="payment-form">
                        <h5>Thanh toán hóa đơn</h5>
                        <Form>
                           <Form.Group controlId="amountPaid">
                              <Form.Label>Số tiền thanh toán</Form.Label>
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


                           <Form.Group controlId="formOfTransfer">
                              <Form.Label>Hình thức thanh toán</Form.Label>
                              <Form.Control
                                 as="select"
                                 value={formOfTransfer}
                                 onChange={(e) => setFormOfTransfer(e.target.value)}
                              >
                                 <option value="">Chọn hình thức</option>
                                 <option value="Tiền mặt">Tiền mặt</option>
                                 <option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng</option>
                                 <option value="Thanh toán online">Thanh toán online</option>
                              </Form.Control>
                           </Form.Group>

                           <Form.Group controlId="dateOfSubmit">
                              <Form.Label>Ngày thanh toán</Form.Label>
                              <Form.Control
                                 type="date"
                                 value={dateOfSubmit}
                                 onChange={(e) => setDateOfSubmit(e.target.value)}
                              />
                           </Form.Group>
                        </Form>
                     </div>
                  </div>
               </Modal.Body>
               <Modal.Footer>
                  <Button
                     variant="primary"
                     onClick={handlePaymentSubmit}
                     disabled={loading}
                  >
                     {loading ? "Đang thanh toán..." : "Thanh toán"}
                  </Button>
               </Modal.Footer>
            </Modal>


            {/* Modal to show invoice details */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
               <Modal.Header closeButton>
                  <Modal.Title>Chi tiết hóa đơn</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  {invoiceDetails ? (
                     <div>
                        <h5>Thông tin hóa đơn</h5>
                        <p><strong>Mã hóa đơn:</strong> {invoiceDetails.id}</p>
                        <p><strong>Tháng/Năm:</strong> {invoiceDetails.billingMonth}/{invoiceDetails.billingYear}</p>
                        <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN').format(invoiceDetails.totalAmount)} đ</p>
                        <p><strong>Trạng thái:</strong>
                           <span className={`badge ${invoiceDetails.isPaid ? "bg-success" : "bg-danger"}`}>
                              {invoiceDetails.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                           </span>
                        </p>

                        {/* Chi tiết dịch vụ hóa đơn */}
                        <Table striped bordered hover>
                           <thead>
                              <tr>
                                 <th>Dịch vụ</th>
                                 <th>Đơn giá</th>
                                 <th>Chi phí thực tế</th>
                                 <th>Số lượng khách</th>
                                 <th>Chỉ số trước</th>
                                 <th>Chỉ số hiện tại</th>
                                 <th>Ngày lập</th>
                              </tr>
                           </thead>
                           <tbody>
                              {invoiceDetails.invoiceDetails.map((detail: any, index: number) => (
                                 <tr key={index}>
                                    <td>{detail.serviceName}</td>
                                    <td className="text-center">{new Intl.NumberFormat('vi-VN').format(detail.unitCost)} đ</td>
                                    <td className="text-center">{new Intl.NumberFormat('vi-VN').format(detail.actualCost)} đ</td>
                                    <td className="text-center">{detail.numberOfCustomer}</td>
                                    <td className="text-center">{detail.previousReading === 0 ? 'N/A' : detail.previousReading}</td>
                                    <td className="text-center">{detail.currentReading === 0 ? 'N/A' : detail.currentReading}</td>
                                    <td className="text-center">{new Date(detail.billingDate).toLocaleDateString()}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
                     </div>
                  ) : (
                     <p>Đang tải thông tin chi tiết...</p>
                  )}
               </Modal.Body>
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
