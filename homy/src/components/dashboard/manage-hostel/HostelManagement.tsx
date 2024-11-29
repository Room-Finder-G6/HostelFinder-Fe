import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { SortDirection } from "@/models/hostel";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import PropertyTableHostel from "./PropertyTableHostel";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import Image from "next/image";

const HostelManagement = () => {
   const [isClient, setIsClient] = useState<boolean>(false);
   const [searchPhrase, setSearchPhrase] = useState<string>("");
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [pageSize, setPageSize] = useState<number>(10);
   const [sortBy, setSortBy] = useState<string | null>("CreatedOn");
   const [sortDirection, setSortDirection] = useState<SortDirection>(
      SortDirection.Ascending
   );
   const [totalPages, setTotalPages] = useState<number>(1);

   useEffect(() => {
      setIsClient(true);
   }, []);

   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchPhrase(e.target.value);
      setPageNumber(1); // Reset to first page when search changes
   };

   const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(e.target.value));
      setPageNumber(1); // Reset to first page when page size changes
   };

   const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const [field, direction] = e.target.value.split(":");
      setSortBy(field);
      setSortDirection(
         direction === "Ascending"
            ? SortDirection.Ascending
            : SortDirection.Descending
      );
   };

   const handlePagination = (page: number) => {
      setPageNumber(page);
   };

   const handlePageChange = (newPageIndex: number) => {
      if (newPageIndex >= 1 && newPageIndex <= totalPages) {
         setPageNumber(newPageIndex);
      }
   };

   if (!isClient) {
      return null;
   }

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="My Properties" />
            <h2 className="main-title d-block d-lg-none">Quản lý nhà trọ</h2>
            <div className="d-sm-flex align-items-center justify-content-between mb-25">
               <div className="d-flex ms-auto xs-mt-30">
                  <div className="fs-16 me-2">Sort by:</div>
                  <input
                     type="text"
                     placeholder="Search..."
                     value={searchPhrase}
                     onChange={handleSearchChange}
                     className="form-control ms-3"
                  />
               </div>
               <div className="d-none d-md-inline-block ms-3">
                  <Link href="/dashboard/add-hostel" className="btn-two">
                     <span>Thêm nhà trọ</span>
                  </Link>
               </div>
            </div>

            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                  <table className="table property-list-table">
                     <thead>
                        <tr>
                           <th scope="col">Nhà trọ</th>
                           <th scope="col">Ngày tạo</th>
                           <th scope="col">Diện tích</th>
                           <th scope="col"></th>
                        </tr>
                     </thead>
                     <PropertyTableHostel
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                     />
                  </table>
               </div>
               <div className="pagination-container">
                  <ul style={{ marginLeft: "15px" }} className="pagination-one d-flex align-items-center style-none pt-40">
                     {/* Previous Button */}
                     <li className="me-3">
                        <Link
                           href="#"
                           onClick={(e) => {
                              e.preventDefault();
                              if (pageNumber > 1) {
                                 handlePagination(pageNumber - 1);
                              }
                           }}
                           className={pageNumber <= 1 ? "disabled" : ""}
                        >
                           Trang trước
                        </Link>
                     </li>

                     {/* Page Numbers */}
                     {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={pageNumber === index + 1 ? "selected" : ""}>
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

                     {/* Ellipsis if more than 5 pages */}
                     {totalPages > 5 && <li>....</li>}

                     {/* Last Button */}
                     <li className="ms-3">
                        <Link
                           href="#"
                           className="d-flex align-items-center"
                           onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNumber + 1);
                           }}
                           style={{ minWidth: '140px' }}
                        >
                           Trang sau
                           <Image src={icon_1} alt="" className="ms-2" />
                        </Link>
                     </li>

                     {/* Page Size Dropdown */}
                     <div className="d-flex align-items-center ms-auto">
                        <div style={{ marginRight: '10px' }}>Số trang</div>
                        <select
                           className="form-select form-select-sm"
                           value={pageSize}
                           onChange={handlePageSizeChange}
                           style={{ width: "80px" }}
                        >
                           <option value="5">5</option>
                           <option value="10">10</option>
                           <option value="15">15</option>
                           <option value="25">25</option>
                        </select>
                        <div style={{ marginLeft: '10px' }}>trang</div>
                     </div>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};

export default HostelManagement;