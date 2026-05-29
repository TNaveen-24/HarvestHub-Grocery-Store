import { ChevronRightIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Baguette from "../assets/Baguette.png";
import BeefSteak from "../assets/Beef Steak.png";
import Coffee from "../assets/Coffee.png";
import Lobster from "../assets/Lobster.png";
import Milk from "../assets/Milk.png";
import Popcorn from "../assets/Popcorn.png";
import Spinach from "../assets/Spinach.png";
import Strawberries from "../assets/Strawberries.png";
import { useTheme } from "../contexts/ThemeContext";
import { allProducts } from "../data/distinctProducts";

const Categories = () => {
  const { isDarkMode } = useTheme();

  // Calculate actual product counts from massive database
  const getProductCount = (categorySlug) => {
    const categoryMap = {
      vegetables: "Vegetables",
      fruits: "Fruits",
      dairy: "Dairy",
      meat: "Meat",
      seafood: "Seafood",
      bakery: "Bakery",
      beverages: "Beverages",
      snacks: "Snacks",
    };

    const categoryName = categoryMap[categorySlug];
    return allProducts.filter((product) => product.category === categoryName)
      .length;
  };

  const categories = [
    {
      name: "Fresh Vegetables",
      image: Spinach,
      icon: "🥬",
      count: `${getProductCount("vegetables")}+ items`,
      slug: "Vegetables",
      description: "Fresh, organic vegetables",
      bgGradient: "from-green-400 to-emerald-500",
    },
    {
      name: "Fresh Fruits",
      image: Strawberries,
      icon: "🍎",
      count: `${getProductCount("fruits")}+ items`,
      slug: "Fruits",
      description: "Juicy, seasonal fruits",
      bgGradient: "from-red-400 to-pink-500",
    },
    {
      name: "Dairy & Eggs",
      image: Milk,
      icon: "🥛",
      count: `${getProductCount("dairy")}+ items`,
      slug: "Dairy",
      description: "Farm-fresh dairy products",
      bgGradient: "from-blue-400 to-indigo-500",
    },
    {
      name: "Meat & Poultry",
      image: BeefSteak,
      icon: "🥩",
      count: `${getProductCount("meat")}+ items`,
      slug: "Meat",
      description: "Premium quality meat",
      bgGradient: "from-red-500 to-orange-500",
    },
    {
      name: "Fresh Seafood",
      image: Lobster,
      icon: "🦞",
      count: `${getProductCount("seafood")}+ items`,
      slug: "Seafood",
      description: "Ocean-fresh seafood",
      bgGradient: "from-teal-400 to-cyan-500",
    },
    {
      name: "Bakery Items",
      image: Baguette,
      icon: "🍞",
      count: `${getProductCount("bakery")}+ items`,
      slug: "Bakery",
      description: "Fresh baked goods daily",
      bgGradient: "from-yellow-400 to-orange-400",
    },
    {
      name: "Beverages",
      image: Coffee,
      icon: "🥤",
      count: `${getProductCount("beverages")}+ items`,
      slug: "Beverages",
      description: "Refreshing drinks",
      bgGradient: "from-purple-400 to-violet-500",
    },
    {
      name: "Snacks & More",
      image: Popcorn,
      icon: "🍿",
      count: `${getProductCount("snacks")}+ items`,
      slug: "Snacks",
      description: "Tasty snacks & treats",
      bgGradient: "from-amber-400 to-yellow-500",
    },
  ];

  return (
    <section
      className={`py-16 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-purple-900"
          : "bg-gradient-to-br from-sky-50 to-blue-50"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-4xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Shop by Category
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Explore our wide range of fresh and quality products across
            different categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.slug}`}
              className={`group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border cursor-pointer hover:scale-105 block ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 hover:border-purple-500"
                  : "bg-white border-gray-100 hover:border-sky-300"
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity`}
                />
                <div className="absolute top-4 right-4 text-3xl transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90 drop-shadow">
                    {category.count}
                  </p>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-bold">FRESH</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {category.description}
                  </p>
                  <ChevronRightIcon
                    className={`w-5 h-5 group-hover:translate-x-1 transition-all ${
                      isDarkMode
                        ? "text-gray-400 group-hover:text-purple-400"
                        : "text-gray-400 group-hover:text-sky-500"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-block bg-gradient-to-r ${category.bgGradient} text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-xl transform group-hover:scale-105 flex items-center`}
                  >
                    <ShoppingBagIcon className="w-4 h-4 mr-2" />
                    Shop Now
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Starting from
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹29
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/products?offer=bestseller"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl text-center hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-bold">Best Sellers</div>
          </Link>
          <Link
            to="/products?offer=deals"
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl text-center hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-2xl mb-2">🔥</div>
            <div className="font-bold">Hot Deals</div>
          </Link>
          <Link
            to="/products?offer=new"
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl text-center hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-2xl mb-2">✨</div>
            <div className="font-bold">New Arrivals</div>
          </Link>
          <Link
            to="/products?offer=organic"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-xl text-center hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-2xl mb-2">🌱</div>
            <div className="font-bold">Organic</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
