import DashboardMembership from "@/components/admin/dashboard-membership";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Quản lí phòng trọ",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardMembership />
      </Wrapper>
   )
}

export default index