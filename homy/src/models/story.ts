import {Address} from "@/models/address";

export interface Story {
    title: string;
    monthlyRentCost: number;
    description: string;
    size: number;
    roomType: number;
    dateAvailable: string;
    address: Address;
    images: string[];
}