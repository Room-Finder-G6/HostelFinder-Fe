import {Address} from "@/models/address";

export interface FilterPosts {
    id: string;
    title: string;
    imageUrl: string;
    status: boolean;
    address: Address;
    dateAvailable: string;
}