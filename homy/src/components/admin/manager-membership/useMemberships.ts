import { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";

interface Membership {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
}

const useMemberships = () => {
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const fetchMemberships = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/Membership/GetListMembership`, {
                params: {
                    pageNumber,
                    pageSize: 10,
                },
            });

            const data = response.data.data.map((membership: any) => ({
                id: membership.id,
                name: membership.name,
                description: membership.description,
                price: membership.price,
                duration: membership.duration,
            }));

            setMemberships(data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching memberships:", error);
        } finally {
            setLoading(false);
        }
    };
    const deleteMembership = async (id: string) => {
        try {
            await apiInstance.delete(`/Membership/DeleteMembership/${id}`);
            fetchMemberships(pageIndex);
            console.log(`Membership with id ${id} deleted successfully`);
        } catch (error) {
            console.error("Error deleting membership:", error);
        }
    };
    const updateMembership = async (id: string, updatedData: any) => {
        try {
            await apiInstance.put(`/Membership/EditMembership/${id}`, updatedData);
            console.log(`Membership with id ${id} updated successfully`);
            fetchMemberships(pageIndex);
        } catch (error) {
            console.error("Error updating membership:", error);
        }
    };
    
    useEffect(() => {
        fetchMemberships(pageIndex);
    }, [pageIndex]);

    return { memberships, loading, totalPages, pageIndex, setPageIndex, deleteMembership, updateMembership };

}
export default useMemberships;
