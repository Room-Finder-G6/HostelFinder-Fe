import { useEffect, useState, ChangeEvent } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import Link from "next/link";
import { toast } from "react-toastify";
import { SortDirection } from "@/models/hostel";
import PropertyTableHostel from "./PropertyTableHostel";

const HostelManagement = () => {
   const [isClient, setIsClient] = useState<boolean>(false);
   const [searchPhrase, setSearchPhrase] = useState<string>("");
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [pageSize, setPageSize] = useState<number>(10);
   const [sortBy, setSortBy] = useState<string | null>("CreatedOn");
   const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Ascending);

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
      setSortDirection(direction === "Ascending" ? SortDirection.Ascending : SortDirection.Descending);
   };

   const handlePagination = (page: number) => {
      setPageNumber(page);
   };

   if (!isClient) {
      return null;
   }

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Nhà trọ của bạn" />
            <h2 className="main-title d-block d-lg-none">Nhà trọ của bạn</h2>
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

                     <PropertyTableHostel/>

                  </table>
               </div>
               <div className="pagination-container">
                  <select
                     className="form-select"
                     value={pageSize}
                     onChange={handlePageSizeChange}
                  >
                     <option value="5">5</option>
                     <option value="10">10</option>
                     <option value="15">15</option>
                     <option value="25">25</option>
                  </select>

                  {/* Pagination Controls */}
                  <button onClick={() => handlePagination(pageNumber - 1)} disabled={pageNumber === 1}>
                     Prev
                  </button>
                  <button onClick={() => handlePagination(pageNumber + 1)} disabled={pageNumber === 1}>
                     Next
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default HostelManagement;
