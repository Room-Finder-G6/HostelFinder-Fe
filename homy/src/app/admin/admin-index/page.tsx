import AdminIndex from "@/components/admin/index";
import Wrapper from "@/layouts/Wrapper";
export const metadata = {
   title: "Admin",
};
const index = () => {
   return (
      <Wrapper>
         <AdminIndex />
      </Wrapper>
   )
}

export default index