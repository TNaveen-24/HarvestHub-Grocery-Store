import {
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  StarIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { allProducts } from "../data/distinctProducts";
import Footer from "./Footer";
import { Navbar } from "./Navbar";

const ProductCatalog = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const offerFilter = searchParams.get("offer");
  const searchFilter = searchParams.get("search");
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFilter || ""
  );
  const [searchTerm, setSearchTerm] = useState(searchFilter || "");
  const [sortOption, setSortOption] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedOffer, setSelectedOffer] = useState(offerFilter || "all");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 20;

  // Get unique categories
  const categories = [
    ...new Set(allProducts.map((product) => product.category)),
  ];

  // Filter and search products
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesOffer =
      selectedOffer === "all" ||
      (selectedOffer === "bestseller" && product.rating >= 4.5) ||
      (selectedOffer === "deals" && product.originalPrice) ||
      (selectedOffer === "new arrivals" && product.isNew) ||
      (selectedOffer === "organic" &&
        (product.name.toLowerCase().includes("organic") ||
          product.tags?.includes("organic")));
    return matchesCategory && matchesSearch && matchesPrice && matchesOffer;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 4.5) - (a.rating || 4.5);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOption, selectedOffer, priceRange]);

  // Update category when URL parameter changes
  useEffect(() => {
    if (categoryFilter) {
      const categoryMap = {
        vegetables: "Vegetables",
        fruits: "Fruits",
        dairy: "Dairy & Eggs",
        meat: "Meat & Poultry",
        seafood: "Seafood",
        bakery: "Bakery & Bread",
        beverages: "Beverages",
        snacks: "Snacks & Sweets",
      };
      setSelectedCategory(categoryMap[categoryFilter] || categoryFilter);
    }
  }, [categoryFilter]);

  // Load cart and favorites from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedFavorites = localStorage.getItem(
      `favorites_${user?.id || "guest"}`
    );
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, [user]);

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    // Show success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
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

  // Toggle favorite function
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

  // Load cart and favorites from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedFavorites = localStorage.getItem(
      `favorites_${user?.id || "guest"}`
    );
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, [user]);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div
          className={`rounded-lg shadow-sm p-6 mb-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <MagnifyingGlassIcon
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm || ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  }`}
                />
              </div>
            </div>

            {/* View Toggle & Filters */}
            <div className="flex items-center gap-4">
              {/* Mobile Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                Filters
              </button>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  View:
                </span>
                <div
                  className={`flex rounded-lg border overflow-hidden ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 text-sm font-medium ${
                      viewMode === "grid"
                        ? isDarkMode
                          ? "bg-purple-600 text-white"
                          : "bg-green-500 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ViewColumnsIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 text-sm font-medium ${
                      viewMode === "list"
                        ? isDarkMode
                          ? "bg-purple-600 text-white"
                          : "bg-green-500 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div
              className={`rounded-lg shadow-sm p-6 sticky top-8 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <FunnelIcon
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Filters
                </h3>
              </div>

              {/* Special Offers Filter */}
              <div className="mb-6">
                <h4
                  className={`text-sm font-medium mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Special Offers
                </h4>
                <div className="space-y-2">
                  {[
                    "all",
                    "bestseller",
                    "deals",
                    "new arrivals",
                    "organic",
                  ].map((offer) => (
                    <label key={offer} className="flex items-center">
                      <input
                        type="radio"
                        name="offer"
                        value={offer}
                        checked={selectedOffer === offer}
                        onChange={(e) => setSelectedOffer(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span
                        className={`ml-3 text-sm capitalize ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {offer === "all" ? "All Products" : offer}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4
                  className={`text-sm font-medium mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Categories
                </h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4
                  className={`text-sm font-medium mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Price Range
                </h4>
                <div className="space-y-3">
                  <div
                    className={`flex items-center justify-between text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      className={`w-full p-2 text-xs border rounded focus:ring-1 focus:ring-green-500 ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300"
                      }`}
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || 5000,
                        ])
                      }
                      className={`w-full p-2 text-xs border rounded focus:ring-1 focus:ring-green-500 ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300"
                      }`}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedOffer("all");
                  setPriceRange([0, 5000]);
                  setSearchTerm("");
                }}
                className={`w-full py-2 px-4 rounded-lg transition-colors text-sm font-medium ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                products
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300"
                }`}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Products Display */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <div
                  className={`mb-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2m-2 0H8m8 0V9a2 2 0 00-2-2H8a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-lg font-medium mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No products found
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 hover:shadow-gray-900/20"
                        : "bg-white border-gray-200"
                    } ${viewMode === "list" ? "flex gap-4 p-4" : "p-4"}`}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list"
                          ? "w-24 h-24 flex-shrink-0"
                          : "w-full h-48"
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Product+Image";
                        }}
                      />

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      >
                        {favorites.has(product.id) ? (
                          <HeartSolidIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                        )}
                      </button>

                      {/* Badge for special offers */}
                      <div className="absolute top-2 left-2 space-y-1">
                        {product.tags?.includes("bestseller") && (
                          <span className="block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                            Bestseller
                          </span>
                        )}
                        {product.tags?.includes("organic") && (
                          <span className="block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            Organic
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            Deal
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`${viewMode === "list" ? "flex-1" : "mt-4"}`}
                    >
                      <h3
                        className={`text-sm font-medium mb-1 line-clamp-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {product.name}
                      </h3>

                      <p
                        className={`text-xs mb-2 line-clamp-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {product.description || "Premium quality product"}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) =>
                            i < Math.floor(product.rating || 4.5) ? (
                              <StarSolidIcon
                                key={i}
                                className="h-3 w-3 text-yellow-400"
                              />
                            ) : (
                              <StarIcon
                                key={i}
                                className="h-3 w-3 text-gray-300"
                              />
                            )
                          )}
                        </div>
                        <span
                          className={`text-xs ml-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          ({product.rating || "4.5"})
                        </span>
                      </div>

                      <div
                        className={`flex items-center justify-between ${
                          viewMode === "list" ? "mt-2" : "mt-auto"
                        }`}
                      >
                        <div>
                          <span
                            className={`text-lg font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span
                              className={`text-sm line-through ml-2 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              ₹{product.originalPrice}
                            </span>
                          )}
                          {product.unit && (
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {product.unit}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <ShoppingCartIcon className="h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                  let page;
                  if (totalPages <= 7) {
                    page = index + 1;
                  } else if (currentPage <= 4) {
                    page = index + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + index;
                  } else {
                    page = currentPage - 3 + index;
                  }

                  if (page < 1 || page > totalPages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-green-500 text-white border-green-500"
                          : isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary - Fixed Position */}
        {cart.length > 0 && (
          <div
            className={`fixed bottom-4 right-4 rounded-xl shadow-lg p-4 border z-50 ${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Cart ({cart.length} items)
              </span>
              <Link
                to="/cart"
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
              >
                View Cart
              </Link>
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Total: ₹
              {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Custom Styles */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ProductCatalog;
