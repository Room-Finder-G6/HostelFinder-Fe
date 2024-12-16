import ManagerUsersAdmin from "@/components/admin/manager-users";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Dashboard Add Hostel Hostel Finder",
};
const index = () => {
   return (
      <Wrapper>
         <ManagerUsersAdmin />
      </Wrapper>
   )
}

export default index