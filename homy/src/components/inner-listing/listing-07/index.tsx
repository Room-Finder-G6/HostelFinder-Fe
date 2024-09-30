
import FancyBanner from "@/components/common/FancyBanner"
import ListingSevenArea from "./ListingSevenArea"
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

const ListingSix = () => {
   return (
      <>
         <HeaderOne />
         <ListingSevenArea style={false} />
         <FancyBanner />
         <FooterOne />
      </>
   )
}

export default ListingSix;
