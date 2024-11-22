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
import CommonReviewForm from "../listing-details-common/CommonReviewForm"
import React, {useEffect, useState} from "react";
import apiInstance from "@/utils/apiInstance";
import {useParams} from "next/navigation";
import Loading from "@/components/Loading";
import {Post} from "@/models/post";
import {Room} from "@/models/room";
import {Hostel} from "@/models/hostel";
import {Amenity} from "@/models/amenity";
import {Service} from "@/models/service";
import GoongMap from "@/components/map/GoongMap";
import {User} from "@/models/user";

export const UserContext = React.createContext<User | null>(null);

const ListingDetailsOneArea = () => {
    const {postId} = useParams();
    const [post, setPost] = useState<Post>();
    const [room, setRoom] = useState<Room>()
    const [hostel, setHostel] = useState<Hostel>();
    const [amenities, setAmenities] = useState<Amenity[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [coordinateHostel, setCoordinateHostel] = useState<[number, number]>([105.83991, 21.02800]);
    const [user, setUser] = useState<User | null>(null)

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const postResponse = await apiInstance.get(`posts/${postId}`);
                const fetchedPost = postResponse.data.data;
                setPost(fetchedPost);

                let fetchedRoom
                const roomResponse = await apiInstance.get(`rooms/${fetchedPost.roomId}`);
                fetchedRoom = roomResponse.data.data;
                setRoom(fetchedRoom);

                const hostelResponse = await apiInstance.get(`hostels/${fetchedPost.hostelId}`);
                const fetchedHostel = hostelResponse.data.data;
                setHostel(fetchedHostel);

                if (fetchedHostel.coordinates) {
                    const coordArray = fetchedHostel.coordinates.split(',').map(Number) as [number, number];
                    setCoordinateHostel(coordArray);
                }

                const amenitiesResponse = await apiInstance.get(`amenities/GetAmenitiesByRoomId/${fetchedRoom.id}`);
                setAmenities(amenitiesResponse.data.data);

                const userResponse = await apiInstance.get(`users/getUserByHostelId/${fetchedPost.hostelId}`);
                setUser(userResponse.data.data);

                const servicesResponse = await apiInstance.get(`services/hostels/${fetchedPost.hostelId}`);
                setServices(servicesResponse.data.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchAllData();
    }, [postId]);


    const handleCoordinatesChange = (newCoordinates: string) => {
        const [lng, lat] = newCoordinates.split(',').map(Number) as [number, number];
        setCoordinateHostel([lng, lat]);
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-150 xl-pb-120">
            <div className="container">
                <CommonBanner title={post?.title} monthlyRentCost={room?.monthlyRentCost} address={hostel?.address}/>
                <MediaGallery imageUrls={post?.imageUrls ?? []}/>
                <div className="property-feature-list bg-white shadow4 border-20 p-40 mt-50 mb-60">
                    <h4 className="sub-title-one mb-40 lg-mb-20">Tổng quan</h4>
                    <CommonPropertyOverview size={room?.size ?? 0}
                                            roomType={room?.roomType ?? 0}
                        /* bedRooms={post?.roomDetailsDto.bedRooms ?? 0}*/
                    />
                </div>

                <div className="row">
                    <div className="col-xl-8">
                        <div className="property-overview mb-50 bg-white shadow4 border-20 p-40">
                            <h4 className="mb-20">Thông tin mô tả</h4>
                            <p className="fs-20 lh-lg">{post?.description}.</p>
                        </div>
                        <div className="property-feature-accordion bg-white shadow4 border-20 p-40 mb-50">
                            <h4 className="mb-20">Dịch vụ chung</h4>
                            <div className="accordion-style-two mt-45">
                                <CommonPropertyFeatureList
                                    services={services}
                                />
                            </div>
                        </div>
                        <div className="property-amenities bg-white shadow4 border-20 p-40 mb-50">
                            <CommonAmenities amenities={amenities ?? []}/>
                        </div>
                        {/*<div className="property-video-tour mb-50">
                            <CommonPropertyVideoTour/>
                        </div>
                        <CommonPropertyFloorPlan style={false}/>
                        <div className="property-nearby bg-white shadow4 border-20 p-40 mb-50">
                            <CommonNearbyList/>
                        </div>
                        <CommonSimilarProperty/>
                        <div className="property-score bg-white shadow4 border-20 p-40 mb-50">
                            <CommonProPertyScore/>
                        </div>*/}
                        <div className="property-location mb-50">
                            <h4 className="mb-20">Xem trên bản đồ</h4>
                            <GoongMap selectedLocation={coordinateHostel}
                                      onCoordinatesChange={handleCoordinatesChange}
                                      showSearch={false}
                            />
                        </div>

                       {/* <div className="review-panel-one bg-white shadow4 border-20 p-40 mb-50">
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
                        <div className="review-form bg-white shadow4 border-20 p-40">
                            <CommonReviewForm/>
                        </div>*/}
                    </div>
                    <UserContext.Provider value={user}>
                        <Sidebar/>
                    </UserContext.Provider>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsOneArea;
