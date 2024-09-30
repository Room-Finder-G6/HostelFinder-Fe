
import FancyBanner from "@/components/common/FancyBanner"
import ListingEightArea from "./ListingEightArea"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"

const ListingEight = () => {
   return (
      <>
         <HeaderOne />
         <ListingEightArea style={false} />
         <FancyBanner />
         <FooterOne />
      </>
   )
}

export default ListingEight;
