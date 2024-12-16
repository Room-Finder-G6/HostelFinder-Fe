import DashboardManagerPost from "@/components/dashboard/manage-post";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Quản lý bài đăng",
};
const index = () => {
   return (
      <Wrapper>
         <DashboardManagerPost />
      </Wrapper>
   )
}

export default index