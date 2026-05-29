import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Bananas from "../assets/Bananas.png";
import BeefSteak from "../assets/Beef Steak.png";
import Milk from "../assets/Milk.png";
import SmokehouseMackerel from "../assets/SmokehouseMackerel.png";
import SourdoughLoaf from "../assets/SourdoughLoaf.png";
import Strawberries from "../assets/Strawberries.png";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const FeaturedProducts = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [favorites, setFavorites] = useState(new Set());
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const featuredProducts = [
    {
      id: 1,
      name: "Organic Bananas",
      price: 249,
      originalPrice: 329,
      image: Bananas,
      rating: 4.8,
      badge: "Organic",
      category: "Fruits",
      description:
        "Fresh organic bananas, rich in potassium and naturally sweet",
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      price: 499,
      originalPrice: 659,
      image: Strawberries,
      rating: 4.9,
      badge: "Fresh",
      category: "Fruits",
      description: "Juicy red strawberries, perfect for snacks and desserts",
    },
    {
      id: 3,
      name: "Whole Milk",
      price: 289,
      originalPrice: null,
      image: Milk,
      rating: 4.7,
      badge: "Premium",
      category: "Dairy",
      description: "Fresh whole milk, rich in calcium and protein",
    },
    {
      id: 4,
      name: "Artisan Bread",
      price: 415,
      originalPrice: 579,
      image: SourdoughLoaf,
      rating: 4.8,
      badge: "Bakery",
      category: "Bakery",
      description: "Handcrafted sourdough bread with a perfect crust",
    },
    {
      id: 5,
      name: "Premium Beef",
      price: 1329,
      originalPrice: 1659,
      image: BeefSteak,
      rating: 4.9,
      badge: "Premium",
      category: "Meat",
      description: "Grade A beef steak, tender and full of flavor",
    },
    {
      id: 6,
      name: "Fresh Salmon",
      price: 1079,
      originalPrice: 1329,
      image: SmokehouseMackerel,
      rating: 4.8,
      badge: "Fresh",
      category: "Seafood",
      description: "Wild-caught fresh salmon, rich in omega-3",
    },
  ];

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);

    // Save to localStorage
    const favoritesArray = Array.from(newFavorites);
    localStorage.setItem(
      `favorites_${user?.id || "guest"}`,
      JSON.stringify(favoritesArray)
    );
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    let newCartItems;

    if (existingItem) {
      newCartItems = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCartItems = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    // Show success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300";
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        ${product.name} added to cart!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 300);
  };

  return (
    <section
      className={`py-16 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-purple-900"
          : "bg-gradient-to-br from-white to-sky-50"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-4xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Featured Products
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Discover our handpicked selection of premium and fresh products at
            great prices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border group hover:scale-105 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 hover:border-purple-500"
                  : "bg-white border-gray-100 hover:border-sky-300"
              }`}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-sky-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md">
                    {product.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-2 rounded-full shadow-md transition-all hover:shadow-lg ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-white hover:bg-red-50"
                    }`}
                  >
                    {favorites.has(product.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    )}
                  </button>
                </div>
                {product.originalPrice && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } truncate`}
                  >
                    {product.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isDarkMode
                        ? "bg-gray-600 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.category}
                  </span>
                </div>

                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } mb-3 line-clamp-2`}
                >
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) =>
                      i < Math.floor(product.rating) ? (
                        <StarSolidIcon
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                        />
                      ) : (
                        <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                      )
                    )}
                  </div>
                  <span
                    className={`text-sm ml-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    ({product.rating})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-2xl font-bold ${
                        isDarkMode ? "text-purple-400" : "text-sky-600"
                      }`}
                    >
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span
                        className={`line-through text-sm ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(product)}
                    className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 text-white ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  <Link
                    to={`/products?category=${product.category}`}
                    className={`font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className={`inline-block font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            }`}
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
