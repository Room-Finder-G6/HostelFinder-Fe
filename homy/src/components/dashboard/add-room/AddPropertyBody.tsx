"use client"
import React, {useEffect, useState} from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import ListingDetails from "./ListingDetails";
import SelectAmenities from "./SelectAmenities";
import AddressAndLocation from "../profile/AddressAndLocation";
import agent from "@/data/agent";
import {date} from "yup";
import apiInstance from "@/utils/apiInstance";

export interface RoomData {
    hostelId: string;
    title: string;
    description: string;
    primaryImageUrl: string;
    roomType: number;
    imagesUrls: string[];
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
        description: 'a',
        primaryImageUrl: 'a',
        roomType: 1,
        imagesUrls: ["string"],
        size: 0,
        monthlyRentCost: 0,
        isAvailable: true,
        dateAvailable: new Date().toISOString(),
        addRoomAmenity: [{ id: '', isSelected: true }],
        roomDetails: {
            bedRooms: 0,
            bathRooms: 0,
            kitchen: 0,
            size: 0,
            status: true,
            otherDetails: 's',
        },
        serviceCosts: [
            {
                serviceName: 'a',
                cost: 0,
            },
        ],
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
    
    const handleSubmit = async () => {
        try {
            console.log("Room data before submit:", roomData);
            const response = await apiInstance.post("rooms", roomData);
            console.log("Room posted successfully:", response);
        } catch (error: any) {
            console.error("Error posting room:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
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
                    <h4 className="dash-title-three">Photo & Video Attachment</h4>
                    <div className="dash-input-wrapper mb-20">
                        <label htmlFor="">File Attachment*</label>

                        <div className="attached-file d-flex align-items-center justify-content-between mb-15">
                            <span>PorpertyImage_01.jpg</span>
                            <button type="button" className="remove-btn">
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="attached-file d-flex align-items-center justify-content-between mb-15">
                            <span>PorpertyImage_02.jpg</span>
                            <button type="button" className="remove-btn">
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                    <div className="dash-btn-one d-inline-block position-relative me-3">
                        <i className="bi bi-plus"></i>
                        Upload File
                        <input type="file" id="uploadCV" name="uploadCV" placeholder=""/>
                    </div>
                    <small>Upload file .jpg, .png, .mp4</small>
                </div>
                <SelectAmenities onDataChange={handleAmenitiesChange}/>
                <AddressAndLocation/>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>
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
