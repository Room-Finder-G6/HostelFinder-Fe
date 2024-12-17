import DashboardService from "@/components/dashboard/manage-service-landlord";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
};
const index = () => {
   return (
      <Wrapper>
         <DashboardService />
      </Wrapper>
   )
}

export default index