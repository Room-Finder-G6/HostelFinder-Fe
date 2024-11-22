import ManagerUsersAdmin from "@/components/admin/manager-users";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Dashboard Add Hostel Homy - Real Estate React Next js Template",
};
const index = () => {
   return (
      <Wrapper>
         <ManagerUsersAdmin />
      </Wrapper>
   )
}

export default index