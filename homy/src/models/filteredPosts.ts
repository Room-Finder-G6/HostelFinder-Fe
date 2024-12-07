import {Address} from "@/models/address";

export interface FilteredPosts {
    id: string;
    wishlistId: string;  // Thêm wishlistId vào đây
    title: string;
    description: string;
    firstImage: string;
    membershipTag: string;
    address: {
        province: string;
        district: string;
        commune: string;
    };
    size: string;
    monthlyRentCost?: number;
    createdOn: string;
    wishlistPostId: string;
}