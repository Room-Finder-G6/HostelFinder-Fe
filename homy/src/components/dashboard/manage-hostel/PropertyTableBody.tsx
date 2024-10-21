import Image, { StaticImageData } from "next/image"
import Link from "next/link"

import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";





const PropertyTableBody = ({ hostels, loading }: { hostels: any[], loading: boolean }) => {
   if (loading) return <p>Loading...</p>;

   // console.log(hostels);
   if(loading) return <p>Loading...</p>
   return (
      <tbody className="border-0">
         {hostels.map((hostel, index) => (
            <tr key={index}>
               <td>
                  <div className="d-lg-flex align-items-center position-relative">
                     {/* <Image src={hostel.image} alt="" className="p-img" /> */}
                     <div className="ps-lg-4 md-pt-10">
                        <Link href="#" className="property-name tran3s color-dark fw-500 fs-20 stretched-link">{hostel.hostelName}</Link>
                        <div className="address">Tên chủ trọ: {hostel.landlordUserName}</div>
                        <strong className="price color-dark">Số phòng: {hostel.numberOfRooms} phòng</strong>
                     </div>
                  </div>
               </td>
               <td>{hostel.size}</td>
               <td>{hostel.rating}</td>
               {/* <td>
                  <div className={`property-status ${item.status_bg}`}>{item.status}</div>
               </td> */}
               <td>{hostel.size}</td>
               <td>
                  <div className="action-dots float-end">
                     <button className="action-btn dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <span></span>
                     </button>
                     <ul className="dropdown-menu dropdown-menu-end">
                        {/*<li><Link className="dropdown-item" href="#"><Image src={icon_1} alt="" className="lazy-img" /> View</Link></li>
                        <li><Link className="dropdown-item" href="#"><Image src={icon_2} alt="" className="lazy-img" /> Share</Link></li>*/}
                        <li><Link className="dropdown-item" href="#"><Image src={icon_3} alt="" className="lazy-img" /> Edit</Link></li>
                        <li><Link className="dropdown-item" href="#"><Image src={icon_4} alt="" className="lazy-img" /> Delete</Link></li>
                     </ul>
                  </div>
               </td>
            </tr>
         ))}
      </tbody>
   )
}

export default PropertyTableBody
