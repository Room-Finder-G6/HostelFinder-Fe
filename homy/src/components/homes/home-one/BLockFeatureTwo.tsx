"use client"
import Image from "next/image"
import Link from "next/link";
import Count from "@/components/common/Count";
import { useState } from "react";
import VideoPopup from "@/modals/VideoPopup";

import featureShape from "@/assets/images/assets/screen_01.png";

const BLockFeatureTwo = () => {

   const [isVideoOpen, setIsVideoOpen] = useState(false);

   return (
      <>
         <div className="block-feature-two mt-150 xl-mt-110">
            <div className="wrapper">
               <div className="row gx-xl-5">


                     <div className="block-two">
                        <div className="bg-wrapper">
                           <h4>Về chúng tôi</h4>
                           <p className="fs-22 mt-20">Chúng tôi là một đội ngũ sáng tạo và nhiệt huyết đến từ Trường Đại học FPT, mang đến giải pháp quản lý và tìm kiếm nhà trọ hiện đại, hiệu quả. <br />Với nền tảng công nghệ tiên tiến, chúng tôi cam kết mang lại trải nghiệm tối ưu cho cả người thuê và chủ nhà.</p>
                           <p className="fs-22 mt-20">Với bộ lọc chi tiết dựa theo khoảng giá, vị trí, diện tích,... bạn có thể dễ dàng chọn lọc bất động sản phù hợp trong hàng ngàn tin rao bán và cho thuê được cập nhật liên tục mỗi ngày. Lượng tin rao chính chủ lớn đáp ứng nhu cầu của những người tìm nhà không qua môi giới. </p>

                            {/*<div className="counter-wrapper ps-xl-3 pb-30 mt-45 mb-50">
                              <div className="row">
                                 <div className="col-6">
                                    <div className="counter-block-one mt-20">
                                       <div className="main-count fw-500 color-dark"><span className="counter"><Count number={1.7} /></span>K+</div>
                                       <span>Completed Project</span>
                                    </div>
                                 </div>
                                 <div className="col-6">
                                    <div className="counter-block-one mt-20">
                                       <div className="main-count fw-500 color-dark"><span className="counter"><Count number={1.3} /></span>mil+</div>
                                       <span>Happy Customers</span>
                                    </div>
                                 </div>
                              </div>
                           </div>*/}


                        </div>
                     </div>
               </div>
            </div>
         </div>
         {/* video modal start */}
         <VideoPopup
            isVideoOpen={isVideoOpen}
            setIsVideoOpen={setIsVideoOpen}
            videoId={"tUP5S4YdEJo"}
         />
         {/* video modal end */}
      </>
   )
}

export default BLockFeatureTwo
