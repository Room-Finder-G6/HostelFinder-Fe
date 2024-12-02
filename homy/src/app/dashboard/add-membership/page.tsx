import UploadImage from "@/components/UploadImage";
import DashboardAddHostel from "@/components/dashboard/manage-hostel/add-hostel";
import Wrapper from "@/layouts/Wrapper";
import AddMembershipBody from "@/components/dashboard/membership/add-membership";
export const metadata = {
};
const index = () => {
   return (
      <Wrapper>
         <AddMembershipBody />
      </Wrapper>
   )
}

export default index