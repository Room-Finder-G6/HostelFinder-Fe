import Link from "next/link"
import {useState} from "react";

const CommonBanner = ({title, monthlyRentCost, style_3, address}: any) => {
    const [showMessage, setShowMessage] = useState(false);

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        navigator.clipboard.writeText(currentUrl).then(() => {
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }).catch((err) => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="row">
            <div className="">
                <h4 className="post-title w-75">{title}.</h4>
                <div className="d-flex flex-wrap mt-10">
                    <div
                        className={`list-type text-uppercase mt-15 me-3 ${style_3 ? "bg-white text-dark fw-500" : "text-uppercase border-20"}`}>Cho
                        thuê
                    </div>
                    <div className="address mt-15">
                        <i className="bi bi-geo-alt"></i>&nbsp;
                        {address?.commune},&nbsp; {address?.district},&nbsp; {address?.province}
                    </div>
                </div>
            </div>
            <div className="text-lg-end">
                <div className="d-inline-block md-mt-40">
                    <h4 className="color-dark fw-500">
                        Mức giá: {monthlyRentCost?.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })}/tháng
                    </h4>
                    <ul className="style-none d-flex align-items-center action-btns justify-content-end ms-auto">
                        <li className="fw-500 color-dark share-container">
                            <div onClick={handleShareClick}>
                                <i className="fa-sharp fa-regular fa-share-nodes me-2"></i>
                                Chia sẻ
                            </div>
                            {showMessage && (
                                <div className="copy-alert">
                                    <div className="copy-alert-content">
                                        <i className="fas fa-check-circle me-2"></i>
                                        Đã sao chép URL
                                    </div>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
            <style jsx>{`
                .share-container {
                    position: relative;
                    cursor: pointer;
                }

                .copy-alert {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    margin-top: 8px;
                    white-space: nowrap;
                    animation: slideDown 0.3s ease-out;
                }

                .copy-alert-content {
                    background-color: #333;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                }

                @keyframes slideDown {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }

                .copy-alert i {
                    color: #4CAF50;
                }

                /* Add a small triangle/arrow pointing up */
                .copy-alert:before {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: 50%;
                    transform: translateX(-50%) rotate(45deg);
                    width: 8px;
                    height: 8px;
                    background-color: #333;
                }
            `}</style>
        </div>
    )
}

export default CommonBanner