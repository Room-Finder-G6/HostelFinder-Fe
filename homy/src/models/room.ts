export interface Room {
    id: string;
    roomName: string;
    floor: number;
    maxRenters: number;
    size: number;
    monthlyRentCost: number;
    roomType: number;
    imageUrls: string[];
    createdOn: string;
}