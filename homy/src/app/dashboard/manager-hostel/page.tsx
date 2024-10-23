import DashboardManagerHostel from "@/components/dashboard/manager-hostel";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Dashboard Add Hostel Homy - Real Estate React Next js Template",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardManagerHostel />
      </Wrapper>
   )
}

export default index