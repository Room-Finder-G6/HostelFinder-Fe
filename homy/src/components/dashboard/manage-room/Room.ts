export interface Room {
    id: string;
    hostelName: string;
    roomName: string;
    floor: number | null;
    maxRenters: number;
    size: number;
    isAvailable: boolean;
    monthlyRentCost: number;
    roomType: number;
    createdOn: string;
    imageRoom: string;
  }
  
  