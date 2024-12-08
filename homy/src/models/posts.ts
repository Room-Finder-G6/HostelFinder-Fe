import {Address} from "@/models/address";

export interface Posts {
    id: string;
    title: string;
    description: string;
    address: Address;
    monthlyRentCost: number;
    size: number;
    membershipTag?: string;
    firstImage: string;
    createdOn: string;
}