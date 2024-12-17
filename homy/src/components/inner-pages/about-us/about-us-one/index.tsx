import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import HeaderOne from "@/layouts/headers/HeaderOne"
import BLockFeatureOne from "./BLockFeatureOne"
import BLockFeatureFive from "@/components/homes/home-one/BLockFeatureFive"
import AgentArea from "@/components/homes/home-one/AgentArea"
import Brand from "./Brand"
import FooterFour from "@/layouts/footers/FooterFour"
import FancyBanner from "@/components/common/FancyBanner"

const AboutUsOne = () => {
   return (
      <>
         <HeaderOne style={true} />
         <BreadcrumbOne title="PHONGTRO247.NET" style={false} />
         <BLockFeatureOne />
         <AgentArea style={false} />
         {/*<BLockFeatureFive style={true} />
         <Brand />
         <FancyBanner style={false} />*/}
         <FooterFour />
      </>
   )
}

export default AboutUsOne
