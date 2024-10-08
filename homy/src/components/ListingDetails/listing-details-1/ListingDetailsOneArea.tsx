"use client"
import NiceSelect from "@/ui/NiceSelect"
import MediaGallery from "./MediaGallery"
import Review from "@/components/inner-pages/agency/agency-details/Review"
import Sidebar from "./Sidebar"
import CommonBanner from "../listing-details-common/CommonBanner"
import CommonPropertyOverview from "../listing-details-common/CommonPropertyOverview"
import CommonPropertyFeatureList from "../listing-details-common/CommonPropertyFeatureList"
import CommonAmenities from "../listing-details-common/CommonAmenities"
import CommonPropertyVideoTour from "../listing-details-common/CommonPropertyVideoTour"
import CommonPropertyFloorPlan from "../listing-details-common/CommonPropertyFloorPlan"
import CommonNearbyList from "../listing-details-common/CommonNearbyList"
import CommonSimilarProperty from "../listing-details-common/CommonSimilarProperty"
import CommonProPertyScore from "../listing-details-common/CommonProPertyScore"
import CommonLocation from "../listing-details-common/CommonLocation"
import CommonReviewForm from "../listing-details-common/CommonReviewForm"
import {useEffect, useState} from "react";
import apiInstance from "@/utils/apiInstance";
import {useRouter} from "next/router";
import {useParams} from "next/navigation";

interface RoomDetails {
    id: string;
    hostelId: string;
    title: string;
    description: string;
    roomType: number;
    size: number;
    monthlyRentCost: number;
    isAvailable: boolean;
    dateAvailable: string;
    imageUrls: string[];
    roomDetailsDto: {
        bedRooms: number;
        bathRooms: number;
        kitchen: number;
        size: number;
        status: boolean;
        otherDetails: string;
    };
    amenityResponses: {
        id: string;
        amenityName: string;
        isSelected: boolean;
    }[];
    serviceCostsDto: {
        serviceName: string;
        cost: number;
    }[];
}

const ListingDetailsOneArea = () => {
    const { roomId } = useParams();
    
    const [room, setRoom] = useState<RoomDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    console.log("Current roomId:", roomId);
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await apiInstance.get(`rooms/${roomId}`);
                console.log("Room details:", response.data.data);
                setRoom(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching room details:", error);
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, []);

    const selectHandler = (e: any) => {
    };
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-150 xl-pb-120">
            <div className="container">
                <CommonBanner title={room?.title} monthlyRentCost={room?.monthlyRentCost}/>
                <MediaGallery/>
                <div className="property-feature-list bg-white shadow4 border-20 p-40 mt-50 mb-60">
                    <h4 className="sub-title-one mb-40 lg-mb-20">Property Overview</h4>
                    <CommonPropertyOverview size={room?.size ?? 0} 
                                            roomType={room?.roomType ?? 0}
                    bedRooms={room?.roomDetailsDto.bedRooms ?? 0}
                    />
                </div>
                <div className="row">
                    <div className="col-xl-8">
                        <div className="property-overview mb-50 bg-white shadow4 border-20 p-40">
                            <h4 className="mb-20">Overview</h4>
                            <p className="fs-20 lh-lg">{room?.description}.</p>
                        </div>
                        <div className="property-feature-accordion bg-white shadow4 border-20 p-40 mb-50">
                            <h4 className="mb-20">Property Features</h4>
                            <div className="accordion-style-two mt-45">
                                <CommonPropertyFeatureList
                                    bedRooms={room?.roomDetailsDto.bedRooms ?? 0}
                                    bathRooms={room?.roomDetailsDto.bathRooms ?? 0}
                                    kitchen={room?.roomDetailsDto.kitchen ?? 0}
                                    size={room?.roomDetailsDto.size ?? 0}
                                    status={room?.roomDetailsDto.status ?? false}
                                />
                            </div>
                        </div>
                        <div className="property-amenities bg-white shadow4 border-20 p-40 mb-50">
                            <CommonAmenities amenities={room?.amenityResponses ?? []} />
                        </div>
                        <div className="property-video-tour mb-50">
                            <CommonPropertyVideoTour/>
                        </div>
                        <CommonPropertyFloorPlan style={false}/>
                        <div className="property-nearby bg-white shadow4 border-20 p-40 mb-50">
                            <CommonNearbyList/>
                        </div>
                        <CommonSimilarProperty/>
                        <div className="property-score bg-white shadow4 border-20 p-40 mb-50">
                            <CommonProPertyScore/>
                        </div>
                        <div className="property-location mb-50">
                            <CommonLocation/>
                        </div>

                        <div className="review-panel-one bg-white shadow4 border-20 p-40 mb-50">
                            <div className="position-relative z-1">
                                <div className="d-sm-flex justify-content-between align-items-center mb-10">
                                    <h4 className="m0 xs-pb-30">Reviews</h4>
                                    <NiceSelect className="nice-select"
                                                options={[
                                                    {value: "01", text: "Newest"},
                                                    {value: "02", text: "Best Seller"},
                                                    {value: "03", text: "Best Match"},
                                                ]}
                                                defaultCurrent={0}
                                                onChange={selectHandler}
                                                name=""
                                                placeholder=""/>
                                </div>
                                <Review style={true}/>
                            </div>
                        </div>
                        <div className="review-form bg-white shadow4 border-20 p-40">
                            <CommonReviewForm/>
                        </div>
                    </div>
                    <Sidebar/>
                </div>
            </div>
        </div>
    )
}

export default ListingDetailsOneArea
