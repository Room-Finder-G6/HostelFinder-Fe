import DashboardAddHostel from "@/components/dashboard/add-hostel";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Thêm mới nhà trọ",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardAddHostel />
      </Wrapper>
   )
}

export default index