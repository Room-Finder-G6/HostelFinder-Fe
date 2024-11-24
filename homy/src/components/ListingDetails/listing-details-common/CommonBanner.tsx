import Link from "next/link"

const CommonBanner = ({ title, monthlyRentCost, style_3, address }: any) => {
   return (
      <div className="row">
         <div className="">
            <h4 className="post-title w-75">{title}.</h4>
            <div className="d-flex flex-wrap mt-10">
               <div className={`list-type text-uppercase mt-15 me-3 ${style_3 ? "bg-white text-dark fw-500" : "text-uppercase border-20"}`}>Cho thuê</div>
               <div className="address mt-15">
                  <i className="bi bi-geo-alt"></i>&nbsp;
                  {address?.commune},&nbsp; {address?.district},&nbsp; {address?.province}
               </div>
            </div>
         </div>
         <div className="text-lg-end">
            <div className="d-inline-block md-mt-40">
                <h4 className=" color-dark fw-500">
                  Mức giá: {monthlyRentCost?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
               })}/tháng
               </h4>
               <ul className="style-none d-flex align-items-center action-btns">
                  <li className="me-auto fw-500 color-dark"><i className="fa-sharp fa-regular fa-share-nodes me-2"></i>
                     Share</li>
                  <li><Link href="#"
                     className={`d-flex align-items-center justify-content-center tran3s ${style_3 ? "" : "rounded-circle"}`}><i
                        className="fa-light fa-heart"></i></Link></li>
                  <li><Link href="#"
                     className={`d-flex align-items-center justify-content-center tran3s ${style_3 ? "" : "rounded-circle"}`}><i
                        className="fa-light fa-bookmark"></i></Link></li>
                  <li><Link href="#"
                     className={`d-flex align-items-center justify-content-center tran3s ${style_3 ? "" : "rounded-circle"}`}><i
                        className="fa-light fa-circle-plus"></i></Link></li>
               </ul>
            </div>
         </div>
      </div>
   )
}

export default CommonBanner
