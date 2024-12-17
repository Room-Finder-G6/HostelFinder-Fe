import Image from "next/image"
import Link from "next/link"
import footer_data from "@/data/home-data/FooterData"

import footerLogo_1 from "@/assets/images/logo/logo_01.svg"
import footerLogo_2 from "@/assets/images/logo/logo_03.svg"
import footerShape_1 from "@/assets/images/shape/shape_32.svg"
import footerShape_2 from "@/assets/images/shape/shape_33.svg"

const icon_1: string[] = ["facebook", "twitter", "instagram"]

const FooterOne = ({style}: any) => {
    return (
        <div className={`footer-one ${style ? "dark-bg" : ""}`}>
            <div className="position-relative z-1">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-4">
                            <div className={`footer-intro ${style ? "position-relative z-1" : ""}`}>
                                <div className="bg-wrapper">
                                    <div className="logo mb-20">
                                        <Link href="/">
                                            <Image src={ footerLogo_2 } alt=""/>
                                        </Link>
                                    </div>
                                    <p className="mb-60 lg-mb-40 md-mb-20">Khu CNC Hòa Lạc, Thạch Thất, Hà Nội</p>
                                    <h6>LIÊN HỆ</h6>
                                    <Link href="#"
                                          className={`email tran3s mb-60 lg-mb-40 ${style ? "font-garamond" : "fs-24 text-decoration-underline"}`}>phongtro247@gmail.com</Link>
                                </div>
                                {style && <Image src={footerShape_1} alt="" className="lazy-img shapes shape_01"/>}
                            </div>
                        </div>
                    </div>
                </div>
                {style && <Image src={footerShape_2} alt="" className="lazy-img shapes shape_02"/>}
            </div>
        </div>
    )
}

export default FooterOne
