"use client"
import Image from "next/image"
import DropdownOne from "@/components/search-dropdown/home-dropdown/DropdownOne";

import titleShape from "@/assets/images/shape/shape_01.svg"
import bannerThumb from "@/assets/images/assets/ils_01.svg"

const Banner = () => {
   return (
      <div className="hero-banner-one bg-pink z-1 pt-225 xl-pt-200 pb-250 xl-pb-150 lg-pb-100 position-relative">
         <div className="container position-relative">
            <div className="row">
               <div className="col-xxl-10 col-xl-9 col-lg-10 col-md-10 m-auto">
                  <h1 className="hero-heading text-center wow fadeInUp" style={{ fontFamily: "'Fira Code', sans-serif" }}>
                     Tìm nhà trọ lý tưởng cho
                     <span className="d-inline-block position-relative">gia đình bạn
                        <Image src={titleShape} alt="" className="lazy-img" />
                     </span>
                  </h1>

               </div>
            </div>
            <div className="row">
               <div className="col-xxl-10 m-auto">
                  <div className="search-wrapper-one layout-one bg position-relative">
                     <div className="bg-wrapper">
                        <DropdownOne style={false} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <Image src={bannerThumb} alt="" className="lazy-img shapes w-100 illustration" />
      </div>
   )
}

export default Banner
