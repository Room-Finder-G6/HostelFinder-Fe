"use client";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBodyPost from "./PropertyTableBodyPost";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import usePost from "./usePost";
import { useEffect, useState } from "react";
import { Post } from "./usePost";


const PostManagement = () => {
   const selectHandler = (e: any) => { };
   const { posts, totalPages, pageIndex, setPageIndex, loading } = usePost();

   const [postsWithUrls, setPostsWithUrls] = useState<Post[]>([]);

   useEffect(() => {
      // Chuyển đổi File[] thành URL[] cho từng post
      const postsData = posts.map(post => {
         const imageUrls = post.images ? post.images.map((file) => URL.createObjectURL(file)) : [];
         return { ...post, imageUrls };
      });

      setPostsWithUrls(postsData);

      return () => {
         // Hủy URL để tránh rò rỉ bộ nhớ
         postsData.forEach(post => {
            post.imageUrls?.forEach(url => URL.revokeObjectURL(url));
         });
      };
   }, [posts]);

   return (
      <div className="dashboard-body">
         <DashboardHeaderTwo title="My Properties" />
         <div className="d-sm-flex align-items-center justify-content-between mb-25">
            <div className="short-filter d-flex align-items-center ms-sm-auto">
               <NiceSelect
                  className="nice-select"
                  options={[
                     { value: "1", text: "Newest" },
                     { value: "2", text: "Best Seller" },
                     { value: "3", text: "Best Match" },
                     { value: "4", text: "Price Low" },
                     { value: "5", text: "Price High" },
                  ]}
                  defaultCurrent={0}
                  onChange={selectHandler}
                  name="sortOptions"
                  placeholder="Select Option"  // Đổi `placeHolder` thành `placeholder`
               />

            </div>
            <li className="d-none d-md-inline-block ms-3">
               <Link href="/dashboard/create-post" className="btn-two" target="_blank">
                  <span>Thêm bài đăng</span>
               </Link>
            </li>
         </div>

         <div className="bg-white card-box p0 border-20">
            <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
               <table className="table property-list-table">
                  <thead>
                     <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr>
                           <td colSpan={4} className="text-center">Loading...</td>
                        </tr>
                     ) : postsWithUrls.length > 0 ? (
                        postsWithUrls.map((post) => (
                           <PropertyTableBodyPost
                              key={post.roomId}
                              hostelId={post.hostelId}
                              roomId={post.roomId}
                              title={post.title}
                              description={post.description}
                              status={post.status}
                              images={post.images} // Truyền URL thay vì File
                              dateAvailable={post.dateAvailable}
                              membershipServiceId={post.membershipServiceId}
                           />
                        ))
                     ) : (
                        <tr>
                           <td colSpan={4} className="text-center">No posts found</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Pagination */}
         <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
            {[...Array(totalPages)].map((_, index) => (
               <li key={index} className={pageIndex === index + 1 ? "selected" : ""}>
                  <Link href="#" onClick={() => setPageIndex(index + 1)}>
                     {index + 1}
                  </Link>
               </li>
            ))}
            {totalPages > 1 && (
               <li className="ms-2">
                  <Link href="#" onClick={() => setPageIndex(totalPages)}>
                     Last <Image src={icon_1} alt="" className="ms-2" />
                  </Link>
               </li>
            )}
         </ul>
      </div>
   );
};

export default PostManagement;
