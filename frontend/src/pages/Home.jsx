import Categories from "../components/Categories.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import { Navbar } from "../components/Navbar.jsx";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </>
  );
};

export default Home;
