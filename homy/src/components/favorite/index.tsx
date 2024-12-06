import FooterFour from "@/layouts/footers/FooterFour"
import FancyBanner from "@/components/common/FancyBanner"
import FavoritesPage from "./FavoritePage"
import HeaderOne from "@/layouts/headers/HeaderOne"

const FavoritePage = () => {
   return (
      <>
         <HeaderOne style={true} />
         <FavoritesPage />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default FavoritePage;
