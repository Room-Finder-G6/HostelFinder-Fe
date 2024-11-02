// import React, { useState } from "react";
// import { RoomData } from "./AddPropertyBody";

// interface ListingDetailsProps {
//     onDataChange: (data: Partial<RoomData>) => void;
// }

// const ListingDetails: React.FC<ListingDetailsProps> = ({ onDataChange }) => {
//     // Khởi tạo state roomDetails với tất cả các thuộc tính cần thiết
//     const [roomDetails, setRoomDetails] = useState({
//         bedRooms: 0,
//         bathRooms: 0,
//         kitchen: 0,
//         size: 0,
//         status: true,
//         otherDetails: ""
//     });

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;

//         // Cập nhật state roomDetails
//         setRoomDetails(prevDetails => {
//             const updatedDetails = {
//                 ...prevDetails,
//                 [name]: name === 'status' ? JSON.parse(value) : value
//             };

//             // Truyền state cập nhật qua onDataChange
//             onDataChange({ roomDetails: updatedDetails });

//             return updatedDetails;
//         });
//     };

//     return (
//         <div className="bg-white card-box border-20 mt-40">
//             <h4 className="dash-title-three">Listing Details</h4>
//             <div className="row align-items-end">
//                 <div className="col-md-6">
//                     <div className="dash-input-wrapper mb-30">
//                         <label htmlFor="bedRooms">Bedrooms*</label>
//                         <input
//                             type="number"
//                             name="bedRooms"
//                             placeholder="0"
//                             value={roomDetails.bedRooms}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className="col-md-6">
//                     <div className="dash-input-wrapper mb-30">
//                         <label htmlFor="bathRooms">Bathrooms*</label>
//                         <input
//                             type="number"
//                             name="bathRooms"
//                             placeholder="0"
//                             value={roomDetails.bathRooms}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className="col-md-6">
//                     <div className="dash-input-wrapper mb-30">
//                         <label htmlFor="kitchen">Kitchens*</label>
//                         <input
//                             type="number"
//                             name="kitchen"
//                             placeholder="0"
//                             value={roomDetails.kitchen}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className="col-md-6">
//                     <div className="dash-input-wrapper mb-30">
//                         <label htmlFor="size">Size*</label>
//                         <input
//                             type="number"
//                             name="size"
//                             placeholder="0"
//                             value={roomDetails.size}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className="col-md-6">
//                     <div className="dash-input-wrapper mb-30">
//                         <label htmlFor="status">Status*</label>
//                         <input
//                             type="text"
//                             name="status"
//                             placeholder="true"
//                             value={roomDetails.status.toString()}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className="col-12">
//                     <div className="dash-input-wrapper">
//                         <label htmlFor="otherDetails">Other Details*</label>
//                         <textarea
//                             className="size-lg"
//                             name="otherDetails"
//                             placeholder="others"
//                             value={roomDetails.otherDetails}
//                             onChange={handleInputChange}
//                         ></textarea>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ListingDetails;
