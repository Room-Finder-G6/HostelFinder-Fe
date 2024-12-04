export interface UpdateRoomRequestDto {
    hostelId: string;
    roomName: string;
    floor: number | null;
    maxRenters: number;
    deposit: number;
    monthlyRentCost: number;
    size: number;
    roomType: number; 
    isAvailable: boolean;
    amenityIds: string[];
    imageRoom: string[];
}