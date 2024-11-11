"use client";
import CommonBanner from "../listing-details-common/CommonBanner";
import MediaGallery from "./MediaGallery";
import CommonPropertyOverview from "../listing-details-common/CommonPropertyOverview";
import CommonPropertyFeatureList from "../listing-details-common/CommonPropertyFeatureList";
import CommonAmenities from "../listing-details-common/CommonAmenities";
import CommonPropertyVideoTour from "../listing-details-common/CommonPropertyVideoTour";
import CommonPropertyFloorPlan from "../listing-details-common/CommonPropertyFloorPlan";
import CommonNearbyList from "../listing-details-common/CommonNearbyList";
import CommonSimilarProperty from "../listing-details-common/CommonSimilarProperty";
import CommonProPertyScore from "../listing-details-common/CommonProPertyScore";
import CommonLocation from "../listing-details-common/CommonLocation";
import CommonReviewForm from "../listing-details-common/CommonReviewForm";
import Review from "@/components/inner-pages/agency/agency-details/Review";
import NiceSelect from "@/ui/NiceSelect";
import Sidebar from "./Sidebar";

const ListingDetailsOneArea = () => {
    const room = {
        title: "Marbel Apartments",
        monthlyRentCost: 24000,
        description: "This is a luxurious apartment located in Twin Tower, Acapulco, Mexico. The apartment offers a great view, spacious rooms, and modern amenities.",
        size: 1370,
        roomType: 1,
        roomDetailsDto: {
            bedRooms: 4,
            bathRooms: 1,
            kitchen: 1,
            size: 1370,
            status: true,
            otherDetails: "Parking Lot and Garden",
        },
        amenityResponses: [
            { id: "1", amenityName: "Gym", isSelected: true },
            { id: "2", amenityName: "Swimming Pool", isSelected: true },
            { id: "3", amenityName: "Parking", isSelected: true },
        ],
        imageUrls: [
            "/assets/images/listing/image1.jpg",
            "/assets/images/listing/image2.jpg",
            "/assets/images/listing/image3.jpg",
        ],
    };

    return (
        <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-150 xl-pb-120">
            <div className="container">
                <CommonBanner title={room.title} monthlyRentCost={room.monthlyRentCost} />
                <MediaGallery imageUrls={room.imageUrls} />

                <div className="property-feature-list bg-white shadow4 border-20 p-40 mt-50 mb-60">
                    <h4 className="sub-title-one mb-40 lg-mb-20">Property Overview</h4>
                    <CommonPropertyOverview
                        size={room.size}
                        roomType={room.roomType}
                        bedRooms={room.roomDetailsDto.bedRooms}
                        bathRooms={room.roomDetailsDto.bathRooms}
                        kitchen={room.roomDetailsDto.kitchen}
                    />
                </div>

                <div className="row">
                    <div className="col-xl-8">
                        <div className="property-overview mb-50 bg-white shadow4 border-20 p-40">
                            <h4 className="mb-20">Overview</h4>
                            <p className="fs-20 lh-lg">{room.description}</p>
                        </div>
                        <div className="property-feature-accordion bg-white shadow4 border-20 p-40 mb-50">
                            <h4 className="mb-20">Property Features</h4>
                            <CommonPropertyFeatureList
                                bedRooms={room.roomDetailsDto.bedRooms}
                                bathRooms={room.roomDetailsDto.bathRooms}
                                kitchen={room.roomDetailsDto.kitchen}
                                size={room.roomDetailsDto.size}
                                status={room.roomDetailsDto.status}
                            />
                        </div>
                        <div className="property-amenities bg-white shadow4 border-20 p-40 mb-50">
                            <CommonAmenities amenities={room.amenityResponses} />
                        </div>

                        <div className="review-panel-one bg-white shadow4 border-20 p-40 mb-50">
                            <div className="position-relative z-1">
                                <div className="d-sm-flex justify-content-between align-items-center mb-10">
                                    <h4 className="m0 xs-pb-30">Reviews</h4>
                                    <NiceSelect
                                        className="nice-select"
                                        options={[
                                            { value: "01", text: "Newest" },
                                            { value: "02", text: "Best Seller" },
                                            { value: "03", text: "Best Match" },
                                        ]}
                                        defaultCurrent={0}
                                        onChange={() => { }}
                                        name=""
                                        placeholder=""
                                    />
                                </div>
                                <Review style={true} />
                            </div>
                        </div>

                    </div>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsOneArea;
