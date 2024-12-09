import Wrapper from "@/layouts/Wrapper";
import DashboardManageFindRoommates from "@/components/dashboard/manage-find-roommates";

export const metadata = {
    title: "Quản lý bài đăng tìm ở ghép"
}

const index = () => {
    return (
        <Wrapper>
            <DashboardManageFindRoommates/>
        </Wrapper>
    )
}

export default index