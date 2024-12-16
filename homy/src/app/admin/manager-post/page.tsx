import ManagerPostAdmin from "@/components/admin/manager-post";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Dashboard Add Hostel Hostel Finder",
};
const index = () => {
   return (
      <Wrapper>
         <ManagerPostAdmin />
      </Wrapper>
   )
}

export default index