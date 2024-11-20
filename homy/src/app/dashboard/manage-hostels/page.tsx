import DashboardManagerHostel from "@/components/dashboard/manage-hostel";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Quản lý nhà trọ",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardManagerHostel />
      </Wrapper>
   )
}

export default index