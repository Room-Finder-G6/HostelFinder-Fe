import RoomManagement from "@/components/dashboard/manage-room/RoomManage";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Quản lý phòng trọ",
};
const index = () => {
   return (
      <Wrapper>
         <RoomManagement />
      </Wrapper>
   )
}

export default index