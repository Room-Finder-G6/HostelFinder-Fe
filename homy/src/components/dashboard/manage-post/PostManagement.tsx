"use client";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import Link from "next/link";
import Image from "next/image";
import icon_1 from "@/assets/images/icon/icon_46.svg";
import { useState } from "react";

const PostManagement = () => {
   const selectHandler = (e: any) => {};
   const [posts, setPosts] = useState([
      {
         title: "Post 1",
         date: "October 10, 2024",
         views: "1.2K",
         status: "Published",
      },
      {
         title: "Post 2",
         date: "October 12, 2024",
         views: "950",
         status: "Draft",
      },
      // Add more posts here
   ]);

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Manage Posts" />
            <h2 className="main-title d-block d-lg-none">Manage Posts</h2>
            
            {/* Header Section */}
            <div className="d-sm-flex align-items-center justify-content-between mb-25">
               <div className="fs-16">
                  Showing <span className="color-dark fw-500">1–{posts.length}</span> of{" "}
                  <span className="color-dark fw-500">40</span> results
               </div>
               <div className="d-flex ms-auto xs-mt-30">
                  <div className="short-filter d-flex align-items-center ms-sm-auto">
                     <div className="fs-16 me-2">Sort by:</div>
                     <NiceSelect
                        className="nice-select"
                        options={[
                           { value: "1", text: "Newest" },
                           { value: "2", text: "Most Viewed" },
                           { value: "3", text: "Top Rated" },
                           { value: "4", text: "Oldest" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder=""
                     />
                  </div>
               </div>
            </div>

            {/* Card Layout for Posts */}
            <div className="card-grid">
               {posts.map((post, index) => (
                  <div key={index} className="post-card">
                     <div className="post-card-header">
                        <h3>{post.title}</h3>
                        <span className={`status ${post.status.toLowerCase()}`}>
                           {post.status}
                        </span>
                     </div>
                     <div className="post-card-body">
                        <p>Date: {post.date}</p>
                        <p>Views: {post.views}</p>
                     </div>
                     <div className="post-card-actions">
                        <Link href="#" className="btn-primary">
                           Edit
                        </Link>
                        <Link href="#" className="btn-danger">
                           Delete
                        </Link>
                     </div>
                  </div>
               ))}
            </div>

            {/* Pagination */}
            <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
               <li className="me-3">
                  <Link href="#">1</Link>
               </li>
               <li className="selected">
                  <Link href="#">2</Link>
               </li>
               <li>
                  <Link href="#">3</Link>
               </li>
               <li>
                  <Link href="#">4</Link>
               </li>
               <li>....</li>
               <li className="ms-2">
                  <Link href="#" className="d-flex align-items-center">
                     Last <Image src={icon_1} alt="" className="ms-2" />
                  </Link>
               </li>
            </ul>

            {/* Floating Add Post Button */}
            <Link href="/dashboard/create-post">
               <div className="floating-add-btn">
                  <span className="plus-icon">+</span>
                  Add Post
               </div>
            </Link>
         </div>
      </div>
   );
};

export default PostManagement;
