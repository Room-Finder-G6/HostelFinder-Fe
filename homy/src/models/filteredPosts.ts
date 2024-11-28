import {Address} from "@/models/address";

export interface FilteredPosts {
    id: string;
    title: string;
    description: string;
    address: Address;
    firstImage: string;
    monthlyRentCost: number;
    size: number;
    membershipTag: string;
    createdOn: string;
}