import DashboardMembership from "@/components/dashboard/membership";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Gói thành viên",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardMembership />
      </Wrapper>
   )
}

export default index