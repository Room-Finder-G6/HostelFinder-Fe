import DashboardAddProperty from "@/components/dashboard/add-room";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Dashboard Add Property Homy - Real Estate React Next js Template",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardAddProperty />
      </Wrapper>
   )
}

export default index