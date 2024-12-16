import Image from "next/image"
import Link from "next/link"

import breadcrumbImg from "@/assets/images/assets/ils_07.svg"
import titleShape from "@/assets/images/shape/shape_01.svg";

const BreadcrumbOne = ({title}: any) => {
    return (
        <div
            className="inner-banner-one inner-banner bg-pink text-center z-1 pt-160 lg-pt-130 pb-160 xl-pb-120 md-pb-80 position-relative h-100">
            <div className="container">
                <h3 className="d-inline-block position-relative mb-30 xl-mb-20 pt-25">
                    &nbsp;{title}
                    <Image
                        src={titleShape}
                        alt="Title Shape"
                        className="lazy-img"
                        width={400}
                        height={400}
                    />
                </h3>

            </div>
            <Image src={breadcrumbImg} alt="" className="lazy-img shapes w-100 illustration"/>
        </div>
    )
}

export default BreadcrumbOne;
