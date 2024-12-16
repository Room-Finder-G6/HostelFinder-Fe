import PropertyList from "@/components/dashboard/report";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Thống kê",
};
const index = () => {
   return (
      <Wrapper>
         <PropertyList />
      </Wrapper>
   )
}

export default index