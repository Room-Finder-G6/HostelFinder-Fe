import {Address} from "@/models/address";

export interface Hostel {
    id: number;
    hostelName: string;
    description: string;
    address: Address;
    size: number;
    numberOfRooms: number;
    image: string[];
    coordinates: string;
    createdOn: string;
}

export enum SortDirection {
    Ascending = "Ascending",
    Descending = "Descending",
  }