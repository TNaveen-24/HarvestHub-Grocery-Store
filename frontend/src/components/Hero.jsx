import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodBanner from "../assets/FoodBanner.png";
import { useTheme } from "../contexts/ThemeContext";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const quickActions = [
    { name: "Vegetables", path: "/products?category=Vegetables", icon: "🥬" },
    { name: "Fruits", path: "/products?category=Fruits", icon: "🍎" },
    {
      name: "Dairy",
      path: "/products?category=Dairy%20%26%20Eggs",
      icon: "🥛",
    },
    {
      name: "Meat",
      path: "/products?category=Meat%20%26%20Poultry",
      icon: "🥩",
    },
    { name: "Deals", path: "/products?offer=deals", icon: "🔥" },
    { name: "Organic", path: "/products?offer=organic", icon: "🌿" },
  ];

  return (
    <section
      className={`relative min-h-screen flex items-center ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50"
      }`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-br from-purple-900/20 via-gray-900/30 to-black/50"
            : "bg-gradient-to-br from-sky-100/50 via-blue-100/30 to-cyan-100/50"
        }`}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="z-10">
            <div
              className={`inline-block px-4 py-2 rounded-full mb-4 border shadow-sm ${
                isDarkMode
                  ? "bg-purple-900/50 text-purple-300 border-purple-700"
                  : "bg-sky-100 text-sky-800 border-sky-200"
              }`}
            >
              🛒 Fresh & Organic
            </div>

            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Fresh{" "}
              <span
                className={`font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${
                  isDarkMode ? "text-purple-400" : "text-sky-700"
                }`}
              >
                Groceries
              </span>{" "}
              Delivered to Your Door
            </h1>

            <p
              className={`text-lg mb-8 leading-relaxed max-w-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Discover the freshest produce, premium meats, and organic
              essentials. Order online and get same-day delivery to your
              doorstep.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-md mb-6">
              <input
                type="text"
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for vegetables, fruits, meat..."
                className={`w-full pl-4 pr-12 py-4 border rounded-full focus:ring-2 focus:border-transparent outline-none shadow-sm ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500"
                    : "bg-white border-sky-200 text-gray-700 placeholder-gray-500 focus:ring-sky-500"
                }`}
              />
              <button
                type="submit"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-colors shadow-lg ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3
                className={`text-sm font-medium mb-3 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Quick Shop:
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.path}
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-sm hover:shadow-md ${
                      isDarkMode
                        ? "bg-gray-800/80 hover:bg-gray-700 border border-gray-600 hover:border-purple-500 text-gray-300 hover:text-purple-300"
                        : "bg-white/80 hover:bg-white border border-sky-200 hover:border-sky-300 text-gray-700 hover:text-sky-700"
                    }`}
                  >
                    <span className="text-base">{action.icon}</span>
                    <span>{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-8">
              <Link
                to="/products"
                className={`inline-flex items-center space-x-2 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
                }`}
              >
                <span>Start Shopping</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center shadow-md border border-sky-100 hover:shadow-lg transition-all hover:scale-105">
                <svg
                  className="h-8 w-8 text-sky-500 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium text-sm text-center">
                  Fast Delivery
                </span>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center shadow-md border border-sky-100 hover:shadow-lg transition-all hover:scale-105">
                <svg
                  className="h-8 w-8 text-sky-500 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium text-sm text-center">
                  Fresh Quality
                </span>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center shadow-md border border-sky-100 hover:shadow-lg transition-all hover:scale-105">
                <svg
                  className="h-8 w-8 text-sky-500 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span className="text-gray-700 font-medium text-sm text-center">
                  Best Prices
                </span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:block hidden">
            <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-white p-4">
              <img
                src={FoodBanner}
                alt="Fresh Groceries"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
