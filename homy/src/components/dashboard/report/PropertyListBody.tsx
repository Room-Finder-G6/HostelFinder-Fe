"use client";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBody from "./PropertyTableBody";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";

const PropertyListBody = () => {
   const selectHandler = (e: any) => { };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Thống kê" />
            <div className="bg-white card-box p0 border-20">
               <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
                  <table className="table property-list-table">
                     <PropertyTableBody />
                  </table>
               </div>
            </div>

            <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
               <li className="me-3"><Link href="#">1</Link></li>
               <li className="selected"><Link href="#">2</Link></li>
               <li><Link href="#">3</Link></li>
               <li><Link href="#">4</Link></li>
               <li>....</li>
               <li className="ms-2"><Link href="#" className="d-flex align-items-center">
                  Last <Image src={icon_1} alt="" className="ms-2" /></Link></li>
            </ul>
         </div>
      </div>
   )
}

export default PropertyListBody;
