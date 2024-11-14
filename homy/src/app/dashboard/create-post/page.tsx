import DashboardAddPost from "@/components/dashboard/create-post";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Tạo bài cho thuê",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardAddPost />
      </Wrapper>
   )
}

export default index