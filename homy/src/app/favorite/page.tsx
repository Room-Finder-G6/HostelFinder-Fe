import FavoritesPage from "@/components/favorite";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Listing Four Homy - Real Estate React Next js Template",
};
const index = () => {
   return (
      <Wrapper>
         <FavoritesPage />
      </Wrapper>
   )
}

export default index