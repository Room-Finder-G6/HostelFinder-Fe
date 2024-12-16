import Error from "@/components/inner-pages/error";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "404 error || Hostel Finder",
};
const index = () => {
   return (
      <Wrapper>
         <Error />
      </Wrapper>
   )
}

export default index