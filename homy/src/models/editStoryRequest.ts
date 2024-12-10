import {Address} from "@/models/address";

export interface EditStoryRequest{
    title: string;
    monthlyRentCost: number;
    description: string;
    size: number;
    roomType: string;
    dateAvailable: string;
    address: Address;
}