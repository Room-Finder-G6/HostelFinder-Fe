import Image from "next/image"

import footerLogo from "@/assets/images/logo/logo_06.svg"
import footerShape from "@/assets/images/assets/ils_06.svg"
import Link from "next/link"
import footer_data from "@/data/home-data/FooterData"

const FooterFour = () => {
   return (
      <div className="footer-four position-relative z-1">
         <div className="container container-large">
            <div className="bg-wrapper position-relative z-1">
               <div className="row">
                  <div className="col-xxl-3 col-lg-4">
                     <div className="footer-intro">
                        <div className="logo mb-20">
                           <Link href="/">
                              <Image src={footerLogo} alt="" />
                           </Link>
                        </div>
                        <p className="mb-60 lg-mb-40 md-mb-20">Khu CNC Hòa Lạc, Thạch Thất, Hà Nội</p>
                        <h6>LIÊN HỆ</h6>
                        <Link href="#" className={`email tran3s mb-70 lg-mb-50 fs-24 text-decoration-underline`}>phongtro247@gmail.com</Link>
                     </div>
                  </div>

               </div>
            </div>
            <div className="bottom-footer">
               <p className="m0 text-center fs-16">Copyright @2024 phongtro247.net</p>
            </div>
         </div>
         <Image src={footerShape} alt="" className="lazy-img shapes shape_01" />
      </div>
   )
}

export default FooterFour
