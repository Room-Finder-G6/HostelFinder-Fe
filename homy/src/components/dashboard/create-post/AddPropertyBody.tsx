"use client"
import React, {useState} from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import ListingDetails from "./ListingDetails";
import SelectAmenities from "./SelectAmenities";
import AddressAndLocation from "../profile/AddressAndLocation";
import apiInstance from "@/utils/apiInstance";
import {toast} from "react-toastify";
import UploadImage from "@/components/UploadImage";

export interface RoomData {
    hostelId: string;
    title: string;
    description: string;
    primaryImage: File | null;
    roomType: number;
    images: File[];
    size: number;
    monthlyRentCost: number;
    isAvailable: boolean;
    dateAvailable: string;
    addRoomAmenity: { id: string; isSelected: boolean }[];
    roomDetails: {
        bedRooms: number;
        bathRooms: number;
        kitchen: number;
        size: number;
        status: boolean;
        otherDetails: string;
    };
    serviceCosts: {
        serviceName: string;
        cost: number;
    }[];
}


const AddPropertyBody: React.FC = () => {
    const [roomData, setRoomData] = useState<RoomData>({
        hostelId: '',
        title: '',
        description: '',
        primaryImage: null,
        roomType: 1,
        images: [],
        size: 0,
        monthlyRentCost: 0,
        isAvailable: true,
        dateAvailable: new Date().toISOString(),
        addRoomAmenity: [],
        roomDetails: {
            bedRooms: 0,
            bathRooms: 0,
            kitchen: 0,
            size: 0,
            status: true,
            otherDetails: '',
        },
        serviceCosts: [],
    });

    const handleData = (data: Partial<RoomData>) => {
        setRoomData((prevData) => ({
            ...prevData,
            ...data,
        }));
    };

    const handleAmenitiesChange = (selectedAmenities: { id: string; isSelected: boolean }[]) => {
        setRoomData((prevData) => ({
            ...prevData,
            addRoomAmenity: selectedAmenities,
        }));
    };

    const handleImageUpload = (files: File[]) => {
        handleData({images: files});
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const validateFileSize = (file: File): boolean => {
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File ${file.name} vượt quá kích thước cho phép (5MB)`);
            return false;
        }
        return true;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (roomData.primaryImage && !validateFileSize(roomData.primaryImage)) {
            return;
        }

        for (const image of roomData.images) {
            if (!validateFileSize(image)) {
                return;
            }
        }
        
        const formData = new FormData();

        // Thêm các trường dữ liệu
        formData.append('hostelId', roomData.hostelId);
        formData.append('title', roomData.title);
        formData.append('description', roomData.description);
        formData.append('roomType', roomData.roomType.toString());
        formData.append('size', roomData.size.toString());
        formData.append('monthlyRentCost', roomData.monthlyRentCost.toString());
        formData.append('isAvailable', roomData.isAvailable.toString());
        formData.append('dateAvailable', roomData.dateAvailable);
        formData.append('addRoomAmenity', JSON.stringify(roomData.addRoomAmenity));
        formData.append('roomDetails', JSON.stringify(roomData.roomDetails));
        formData.append('serviceCosts', JSON.stringify(roomData.serviceCosts));

        if (roomData.primaryImage) {
            formData.append('primaryImage', roomData.primaryImage);
        }

        roomData.images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        try {
            console.log('Sending data:', formData);
            const response = await apiInstance.post("post", formData);
            console.log("Response:", response);
            toast.success("Tạo bài đăng thành công", { position: "top-center" });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(`Có lỗi xảy ra: ${error.response?.data?.detail || error.message}`, { position: "top-center" });
        }
    };

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Add New Post"/>
                <h2 className="main-title d-block d-lg-none">Add New Property</h2>
                <Overview onDataChange={handleData}/>
                <ListingDetails onDataChange={handleData}/>

                <div className="bg-white card-box border-20 mt-40">
                    <h4 className="dash-title-three">Photo</h4>
                    <UploadImage onImageUpload={handleImageUpload} multiple={true}/>
                </div>
                <SelectAmenities onDataChange={handleAmenitiesChange}/>
                <AddressAndLocation/>

                <form onSubmit={handleSubmit}>
                    <div className="button-group d-inline-flex align-items-center mt-30">
                        <button type="submit" className="dash-btn-two tran3s me-3">
                            Submit Property
                        </button>
                        <button type="button" className="dash-cancel-btn tran3s">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyBody;