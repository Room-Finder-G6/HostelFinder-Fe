export interface Post {
    id: string;
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    imageUrls: string[];
    status: boolean;
    dateAvailable: string;
}