import DashboardRentalContract from "@/components/dashboard/manage-rental-contract";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Quản lí hợp đồng"
};
const index = () => {
   return (
      <Wrapper>
         <DashboardRentalContract />
      </Wrapper>
   )
}

export default index