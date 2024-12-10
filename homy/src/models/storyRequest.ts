import {Address} from "@/models/address";

export interface StoryRequest {
    userId: number;
    title: string;
    description: string;
    monthlyRentCost: number;
    size: number;
    roomType: string
    addressStory: Address
    dateAvailable: string;
    images: File[]
}