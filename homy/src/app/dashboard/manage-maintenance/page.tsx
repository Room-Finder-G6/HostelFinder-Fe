import DashboardMainTenance from "@/components/dashboard/manage-maintenance";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Lịch sử sữa chữa",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardMainTenance />
      </Wrapper>
   )
}

export default index