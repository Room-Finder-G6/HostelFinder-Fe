import ManagerMembershipAdmin from "@/components/admin/manager-membership";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Quản lí phòng trọ",
};
const index = () => {
   return (
      <Wrapper>
         <ManagerMembershipAdmin />
      </Wrapper>
   )
}

export default index