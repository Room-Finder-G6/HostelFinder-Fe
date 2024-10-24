import DashboardAddProperty from "@/components/dashboard/create-post";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Tạo bài cho thuê",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardAddProperty />
      </Wrapper>
   )
}

export default index