import boot from "../../../assets/images/misc/boots.png";
import banner from  "../../../assets/images/banners/banner.png";
import FeaturedItems from "./FeaturedItems";
import "./Home.scss";
import TabProducts from "./TabProducts";
import FeatureProduct from "./FeatureProduct";
import ServiceSection from "./ServiceSection";
import BrandAndProductSection from "./BrandSection";
function Home() {
  return (
    <>
      <div className="header__background">
        <div className="header__slogan header__slogan--top">Step in Style</div>
        <img src={boot} alt="Ski Boots" className="header__boot-image header__boot-image--show" />
        <div className="header__slogan header__slogan--bottom">Conquer Every Journey!</div>
      </div>
      <FeaturedItems />
      <div className="banner">
        <img src={banner} alt="Banner" />
      </div>

      <TabProducts/>
      <FeatureProduct/>
      <ServiceSection/>
      <BrandAndProductSection/>
    </>
  )
}

export default Home;