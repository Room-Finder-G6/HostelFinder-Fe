"use client";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBody from "./PropertyTableBody";
import Link from "next/link";
import Image from "next/image";
import AddHostelForm from "../add-hostel/AddHostelForm"; // Import your AddHostelForm component
import icon_1 from "@/assets/images/icon/icon_46.svg";
import useHostels from "./useHostels";

const HostelManagement = () => {
   const selectHandler = (e: any) => { };
   const {hostels,totalPages, pageIndex, setPageIndex, totalRecords, loading} = useHostels();
   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="My Properties" />
            <h2 className="main-title d-block d-lg-none">My Properties</h2>
            <div className="d-sm-flex align-items-center justify-content-between mb-25">
               <div className="fs-16">Hiển thị <span className="color-dark fw-500">{(pageIndex - 1) * 10 + 1}</span>  to{" "} <span
                  className="color-dark fw-500">{totalRecords}</span> kết quả</div>
               <div className="d-flex ms-auto xs-mt-30">
                  <div className="short-filter d-flex align-items-center ms-sm-auto">
                     <div className="fs-16 me-2">Sort by:</div>
                     <NiceSelect className="nice-select"
                        options={[
                           { value: "1", text: "Newest" },
                           { value: "2", text: "Best Seller" },
                           { value: "3", text: "Best Match" },
                           { value: "4", text: "Price Low" },
                           { value: "5", text: "Price High" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder="" />
                  </div>
                  {/* Add Hostel Button */}
                  <li className="d-none d-md-inline-block ms-3">
                     <Link href="/dashboard/add-hostel" className="btn-two" target="_blank"><span>Add Hostel</span>
                     </Link>
                  </li>
               </div>
            </div>


            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                  <table className="table property-list-table">
                     <thead>
                        <tr>
                           <th scope="col">Phòng trọ</th>
                           <th scope="col">Diện tích</th>
                           <th scope="col">Đánh giá</th>
                           <th scope="col">Ảnh</th>
                           <th scope="col">Hành động</th>
                        </tr>
                     </thead>
                     <PropertyTableBody hostels={hostels} loading ={loading} />
                  </table>
               </div>
            </div>

            <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
               {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={pageIndex === index + 1 ? "selected" : ""}>
                     <button onClick={() => setPageIndex(index + 1)}>{index + 1}</button>
                  </li>
               ))}
               <li className="ms-2">
                  <Link href="#" className="d-flex align-items-center">
                     Last <Image src={icon_1} alt="" className="ms-2" />
                  </Link>
               </li>
            </ul>
         </div>
      </div>
   )
}

export default HostelManagement;
