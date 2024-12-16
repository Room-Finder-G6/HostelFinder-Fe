import { useCallback, useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import Link from "next/link";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import './css/rental-contract.css';
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import HostelSelector from "../manage-room/HostelSelector";
import { toast } from "react-toastify";
import { Button, ButtonGroup, ButtonToolbar, Card, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

interface RentalContract {
   id: string;
   roomName: string;
   tenantName: string;
   startDate: string;
   endDate: string | null;
   monthlyRent: number;
   depositAmount: number;
   status: string;
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
   data: RentalContract[];
}

interface JwtPayload {
   UserId: string;
}

const InvoiceBody = () => {
   const [hostels, setHostels] = useState<Hostel[]>([]);
   const [selectedHostel, setSelectedHostel] = useState<string>('');
   const [rentalContracts, setRentalContract] = useState<RentalContract[]>([]);
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
   const [statusFilter, setStatusFilter] = useState<string>("");

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

   const fetchRentalContract = async () => {
      if (!selectedHostel) {
         setRentalContract([]);
         return;
      }

      try {
         const response = await apiInstance.get(
            `/rental-contracts/getRentalContractsByHostel?hostelId=${selectedHostel}&searchPhrase=${searchPhrase}&&statusFilter=${statusFilter}&pageNumber=${pageIndex}&pageSize=${pageSize}`
         );
         if (response.status === 200 && response.data.succeeded) {
            const data: PagedResponse = await response.data;
            setRentalContract(data.data);
            setTotalRecords(data.totalRecords);
            setTotalPages(data.totalPages);
         }
      } catch (error) {
         console.error("Error fetching invoices:", error);
         toast.warning("Vui lòng chọn nhà trọ để xem hóa đơn");
         setRentalContract([]);
      }
   };


   useEffect(() => {
      fetchHostels();
   }, []);

   useEffect(() => {
      fetchRentalContract();
   }, [selectedHostel, pageIndex, pageSize, searchPhrase, statusFilter]);

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
      fetchRentalContract();
   };

   const handleHostelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedHostel(event.target.value);
      setPageIndex(1); // Reset lại trang khi thay đổi nhà trọ
   };

   const getContractStatusClass = (status: string): string => {


      // Nếu hợp đồng đã kết thúc
      if (status == "Đã kết thúc") {
         return "bg-danger text-white";  // Màu đỏ cho "Kết thúc hợp đồng"
      }

      // Nếu hợp đồng sắp hết hạn trong vòng 1 tuần
      if (status == "Sắp kết thúc") {
         return "bg-warning text-dark";  // Màu vàng cho "Sắp hết hạn"
      }

      // Nếu hợp đồng còn thời hạn
      if (status == "Trong thời hạn") {
         return "bg-success text-white";  // Màu xanh lá cho "Đang trong thời hạn"
      }

      return "bg-secondary text-gray";  // Màu xám cho "Chưa bắt đầu"
   };

   const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(event.target.value);
   };


   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Quản lý hợp đồng" />
            <h2 className="main-title d-block d-lg-none">Quản lý hợp đồng</h2>

            {/* Chọn nhà trọ */}
            <HostelSelector
               selectedHostel={selectedHostel}
               onHostelChange={handleHostelChange}
            />

            {/* Form tìm kiếm */}
            {selectedHostel && (
               <Card className="mb-4">
                  <Card.Body>
                     <InputGroup className="mb-3">
                        <Form.Control
                           type="text"
                           placeholder="Tìm kiếm"
                           value={searchPhrase}
                           onChange={(e) => setSearchPhrase(e.target.value)}
                        />
                        <Button variant="primary">
                           <FaSearch />
                        </Button>
                     </InputGroup>

                     <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="mb-3"
                     >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Trong thời hạn">Trong thời hạn</option>
                        <option value="Sắp kết thúc">Sắp kết thúc</option>
                        <option value="Đã kết thúc">Đã kết thúc</option>
                        <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                     </Form.Select>
                  </Card.Body>
               </Card>
            )}
            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                  <table className="table saved-search-table">
                     <thead>
                        <tr>
                           {/* <th scope="col">Mã hóa đơn</th> */}
                           <th scope="col">Người đại diện hợp đồng</th>
                           <th scope="col">Tên phòng</th>
                           <th scope="col">Thời gian hợp đồng</th>
                           <th scope="col">Tiền thuê hằng tháng</th>
                           <th scope="col">Tiền cọc</th>
                           <th scope="col">Trạng thái</th>
                           <th scope="col">Hành động</th>
                        </tr>
                     </thead>
                     <tbody className="border-0">
                        {rentalContracts.map((rentalContract) => (
                           <tr key={rentalContract.id}>
                              {/* <td>{rentalContract.id}</td> */}
                              <td>
                                 <Link href="#" className="property-name tran3s color-dark fw-500">
                                    {rentalContract.tenantName}
                                 </Link>
                              </td>
                              <td>
                                 {rentalContract.roomName}
                              </td>
                              <td>
                                 {new Date(rentalContract.startDate).toLocaleDateString('en-GB')} -
                                 {rentalContract.endDate ? new Date(rentalContract.endDate).toLocaleDateString('en-GB') : "N/A"}
                              </td>
                              <td>{rentalContract.monthlyRent.toLocaleString('vi-VN')} ₫</td>
                              <td>{rentalContract.depositAmount.toLocaleString('vi-VN')} ₫</td>
                              <td>
                                 <span className={`badge ${getContractStatusClass(rentalContract.status)}`}>
                                    {rentalContract.status}
                                 </span>
                              </td>
                              <td>
                                 <div className="d-flex justify-content-end btns-group">

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
      </div >
   );
};

export default InvoiceBody;
