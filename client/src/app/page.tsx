import HeroBanner from "../components/landing/HeroBanner";
import Companies from "../components/landing/Companies";
import PopularServices from "../components/landing/PopularServices";
import Everything from "../components/landing/Everything";
import Services from "../components/landing/Services";
import FiverrBusiness from "../components/landing/FiverrBusiness";
import JoinFiverr from "../components/landing/JoinFiverr";
import AuthProvider from "../components/auth/AuthProvider";
export default function Home() {
  return (
    <div>
      <HeroBanner />
      <Companies />
      <PopularServices />
      <Everything />
      <Services />
      <FiverrBusiness />
      <JoinFiverr />
      <AuthProvider />
    </div>
  );
}
