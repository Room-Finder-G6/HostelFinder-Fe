import apiInstance from "@/utils/apiInstance";
export const fetchHostelsByLandlordId = async (landlordId: string) => {
  try {
    const response = await apiInstance.get(`/hostels/GetHostelsByLandlordId/${landlordId}`);
    if (response.data.succeeded) {
      return response.data.data;
    }
    throw new Error("Không thể tải danh sách nhà trọ.");
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw new Error("Có lỗi xảy ra khi tải danh sách nhà trọ.");
  }
};
