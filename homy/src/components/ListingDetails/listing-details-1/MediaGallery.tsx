import Image from "next/image";
import Fancybox from "@/components/common/Fancybox";
import { useEffect } from "react";

interface MediaGalleryProps {
    imageUrls: string[];
    style?: string;
}

const MediaGallery = ({ imageUrls, style }: MediaGalleryProps) => {
    useEffect(() => {
        // Import Bootstrap carousel when component mounts
        if (typeof window !== 'undefined') {
            require('bootstrap/js/dist/carousel');
        }
    }, []);

    return (
        <div className="media-gallery mt-50 xl-mt-80 lg-mt-60">
            <div id="media_slider" className="carousel slide row" data-bs-ride="carousel">
                <div className="col-lg-10">
                    <div className={`bg-white border-20 md-mb-20 ${style ? "" : "shadow4 p-30"}`}>
                        <div className="position-relative z-1 overflow-hidden border-20">
                            <div className="img-fancy-btn border-10 fw-500 fs-16 color-dark">
                                Xem tất cả hình ảnh
                                <Fancybox
                                    options={{
                                        Carousel: {
                                            infinite: true,
                                        },
                                    }}
                                >
                                    {imageUrls.map((url: string, index: number) => (
                                        <a key={index} className="d-block" data-fancybox="img2" href={url}></a>
                                    ))}
                                </Fancybox>
                            </div>

                            <div className="carousel-inner">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                        <Image
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            width={800}
                                            height={600}
                                            className="w-100 border-20"
                                            style={{objectFit: 'cover'}}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#media_slider"
                                data-bs-slide="prev"
                            >
                                <i className="bi bi-chevron-left"></i>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#media_slider"
                                data-bs-slide="next"
                            >
                                <i className="bi bi-chevron-right"></i>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-2">
                    <div
                        className={`carousel-indicators position-relative p-15 w-100 ${style ? "" : "border-15 bg-white shadow4"}`}
                        style={{height: '600px'}}
                    >
                        {imageUrls.slice(0, 7).map((url, i) => (
                            <button
                                key={i}
                                type="button"
                                data-bs-target="#media_slider"
                                data-bs-slide-to={i}
                                className={i === 0 ? "active" : ""}
                                aria-current={i === 0 ? "true" : "false"}
                                aria-label={`Slide ${i + 1}`}
                                style={{
                                    height: '100px',
                                    marginBottom: '10px',
                                    width: '100%',
                                    border: 'none',
                                    position: 'relative'
                                }}
                            >
                                <Image
                                    src={url}
                                    alt={`Thumbnail ${i + 1}`}
                                    width={100}
                                    height={100}
                                    className="w-100 border-10"
                                    style={{objectFit: 'cover', height: '100%'}}
                                />
                                {i === 6 && imageUrls.length > 7 && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        +{imageUrls.length - 7}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaGallery;