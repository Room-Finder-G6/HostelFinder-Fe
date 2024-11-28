import DashboardSavedSearch from "@/components/dashboard/manage-invoice";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Quản lí hóa đơn",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardSavedSearch />
      </Wrapper>
   )
}

export default index