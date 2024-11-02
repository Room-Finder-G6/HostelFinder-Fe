import RoomManagement from "@/components/dashboard/manage-room/RoomManage";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Dashboard Add Hostel Homy - Real Estate React Next js Template",
};
const index = () => {
   return (
      <Wrapper>
         <RoomManagement />
      </Wrapper>
   )
}

export default index