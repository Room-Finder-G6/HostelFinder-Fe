import DashboardTenant from "@/components/dashboard/manage-tenant";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
};
const index = () => {
   return (
      <Wrapper>
         <DashboardTenant />
      </Wrapper>
   )
}

export default index