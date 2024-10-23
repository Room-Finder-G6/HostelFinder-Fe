import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";

interface HostelData {
    landlordUserName: string;
    hostelName: string;
    description: string;
    size: number;
    numberOfRooms: number;
    rating: number;
    image: string | null;
}

const useHostels = () => {
    const[hostels, setHostels] = useState<HostelData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState(1);
    const[pageIndex, setPageIndex] = useState(1);
    const[totalRecords, setTotalRecords] = useState(0);

    const fetchHostels = async (pageNumber : number) => {
        setLoading(true);

        try{
            const response = await apiInstance.post("hostels/get-all", {
                pageNumber : pageIndex,
                pageSize : 10,
                sortDirection: 0
            });
            setHostels(response.data.data || []);
            setTotalPages(response.data.totalPages);
            setTotalRecords(response.data.totalRecords);
            console.log(response.data.totalRecords);
        }catch(error){
            console.error("Error fetching hostel: ", error);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHostels(pageIndex);
    }, [pageIndex]);

    return {hostels, loading, totalPages, totalRecords, pageIndex, setPageIndex};
}
export default useHostels;