import { useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import Link from "next/link";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import './css/invoice.css';
import apiInstance from "@/utils/apiInstance";
// Định nghĩa kiểu dữ liệu trả về từ API
interface Invoice {
   id: string;
   roomName: string;
   billingMonth: number;
   billingYear: number;
   totalAmount: number;
   isPaid: boolean;
}

interface PagedResponse {
   pageIndex: number;
   pageSize: number;
   totalPages: number;
   totalRecords: number;
   data: Invoice[];
}

const InvoiceBody = () => {
   const [invoices, setInvoices] = useState<Invoice[]>([]);
   const [totalRecords, setTotalRecords] = useState<number>(0);
   const [pageIndex, setPageIndex] = useState<number>(1);
   const [pageSize, setPageSize] = useState<number>(10);
   const [totalPages, setTotalPages] = useState<number>(1);
   const [searchPhrase, setSearchPhrase] = useState<string>("");

   // Hàm gọi API để lấy hóa đơn
   const fetchInvoices = async () => {
      const response = await apiInstance.get(
         `/invoices/getInvoicesByHostelId?hostelId=5AB7087B-6C5B-40D3-8C9F-3A548435AF9D&searchPhrase=${searchPhrase}&pageNumber=${pageIndex}&pageSize=${pageSize}`
      );
      const data: PagedResponse = await response.data;
      setInvoices(data.data);
      setTotalRecords(data.totalRecords);
      setTotalPages(data.totalPages);
   };

   // Gọi API khi component được render hoặc khi thay đổi trang, searchPhrase
   useEffect(() => {
      fetchInvoices();
   }, [pageIndex, pageSize, searchPhrase]);

   // Xử lý chuyển trang
   const handlePageChange = (newPageIndex: number) => {
      if (newPageIndex >= 1 && newPageIndex <= totalPages) {
         setPageIndex(newPageIndex);
      }
   };

   // Xử lý thay đổi từ khóa tìm kiếm
   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchPhrase(event.target.value);
   };

   // Xử lý sự kiện submit tìm kiếm (nếu muốn tìm kiếm khi nhấn Enter)
   const handleSearchSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      fetchInvoices();
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Quản lí hóa đơn" />
            <h2 className="main-title d-block d-lg-none">Quản lí hóa đơn</h2>
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



            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                  <table className="table saved-search-table">
                     <thead>
                        <tr>
                           <th scope="col">Mã hóa đơn</th>
                           <th scope="col">Tên phòng</th>
                           <th scope="col">Thời gian tạo hóa đơn</th>
                           <th scope="col">Tổng tiền</th>
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
                                    {invoice.isPaid ? "Paid" : "Unpaid"}
                                 </span>
                              </td>
                              <td>
                                 <div className="d-flex justify-content-end btns-group">
                                    <Link href="#">
                                       <i className="fa-sharp fa-regular fa-eye" data-bs-toggle="tooltip" title="View"></i>
                                    </Link>
                                    <Link href="#" data-bs-toggle="tooltip" title="Delete">
                                       <i className="fa-regular fa-trash"></i>
                                    </Link>
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
               {/* Previous */}
               <li className="me-3">
                  <Link
                     href="#"
                     onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageIndex - 1);
                     }}
                     className={pageIndex === 1 ? "disabled" : ""}
                  >
                     Previous
                  </Link>
               </li>

               {/* Các trang */}
               {[...Array(totalPages)].map((_, index) => (
                  <li
                     key={index}
                     className={pageIndex === index + 1 ? "selected" : ""}
                  >
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

               {/* Dấu ... nếu có quá nhiều trang */}
               {totalPages > 5 && <li>....</li>}

               {/* Trang cuối */}
               <li className="ms-2">
                  <Link
                     href="#"
                     className="d-flex align-items-center"
                     onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                     }}
                  >
                     Last <Image src={icon_1} alt="" className="ms-2" />
                  </Link>
               </li>
            </ul>
         </div>
      </div>
   );
};

export default InvoiceBody;
