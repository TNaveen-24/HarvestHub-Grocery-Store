import {
  CheckCircleIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Footer from "./Footer.jsx";
import { Navbar } from "./Navbar.jsx";

const About = () => {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: CheckCircleIcon,
      title: "Fresh & Organic",
      description:
        "We source the freshest organic produce directly from local farmers and trusted suppliers.",
    },
    {
      icon: TruckIcon,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery service to bring fresh groceries right to your doorstep.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Quality Assured",
      description:
        "Every product goes through rigorous quality checks to ensure you get the best.",
    },
    {
      icon: HeartIcon,
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We provide excellent customer service and support.",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "5,000+", label: "Products Available" },
    { number: "500+", label: "Local Farmers" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen pt-20 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800"
            : "bg-gradient-to-b from-sky-50 to-white"
        }`}
      >
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1
                className={`text-4xl md:text-6xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                About <span className="text-sky-600">HarvestHub</span>
              </h1>
              <p
                className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your trusted partner for fresh, quality groceries delivered
                right to your doorstep. We're revolutionizing the way India
                shops for groceries.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Our Mission
                </h2>
                <p
                  className={`text-lg mb-6 leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  At HarvestHub, we believe everyone deserves access to fresh,
                  high-quality groceries without the hassle of traditional
                  shopping. We're committed to supporting local farmers,
                  reducing food waste, and making healthy eating accessible to
                  all.
                </p>
                <p
                  className={`text-lg leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our platform connects you directly with trusted suppliers and
                  local farmers, ensuring you get the freshest produce while
                  supporting the farming community across India.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
                  alt="Fresh vegetables and fruits"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-sky-600 text-white p-6 rounded-xl shadow-xl">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm">Fresh Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={`py-16 px-4 sm:px-6 lg:px-8 ${
            isDarkMode ? "bg-gray-800" : "bg-sky-50"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Why Choose HarvestHub?
              </h2>
              <p
                className={`text-lg max-w-2xl mx-auto ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                We're not just another grocery delivery service. Here's what
                makes us different.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 hover:shadow-gray-900/20"
                      : "bg-white"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      isDarkMode ? "bg-sky-900" : "bg-sky-100"
                    }`}
                  >
                    <feature.icon className="w-6 h-6 text-sky-600" />
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                HarvestHub by Numbers
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
                    {stat.number}
                  </div>
                  <div
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Our Values
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Sustainability
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  We're committed to reducing our environmental impact through
                  sustainable sourcing and eco-friendly packaging solutions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Community
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Supporting local farmers and communities is at the heart of
                  everything we do. Together, we build stronger food systems.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Quality
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  We never compromise on quality. Every product is carefully
                  selected and thoroughly inspected before reaching your table.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sky-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the HarvestHub Difference?
            </h2>
            <p className="text-xl text-sky-100 mb-8">
              Join thousands of satisfied customers who trust us for their daily
              grocery needs.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-block text-center bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Start Shopping Now
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-block text-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sky-600 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
