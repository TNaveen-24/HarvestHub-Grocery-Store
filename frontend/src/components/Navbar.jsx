import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const { user, isAuthenticated, logout, loading } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setCartCount(totalItems);
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes (cart updates)
    window.addEventListener("storage", updateCartCount);

    // Listen for custom cart update events
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileMenu(false);
    };

    if (showProfileMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Conditional nav items for authenticated users
  const authNavItems = isAuthenticated
    ? [
        ...navItems,
        { name: "My Orders", path: "/orders" },
        { name: "Profile", path: "/profile" },
      ]
    : navItems;

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-700 ease-out ${
        isDarkMode
          ? scrolled
            ? "bg-gray-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)] h-16"
            : "bg-gradient-to-r from-gray-800 via-gray-900 to-black h-20"
          : scrolled
          ? "bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.3)] h-16"
          : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-20"
      }`}
    >
      {/* Dynamic gradient border that changes on scroll */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-700 ${
          isDarkMode
            ? scrolled
              ? "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
              : "bg-gradient-to-r from-purple-300 via-pink-300 to-red-300"
            : scrolled
            ? "bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400"
            : "bg-gradient-to-r from-blue-300 via-blue-200 to-sky-200"
        }`}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute w-20 h-20 rotate-45 transition-all duration-1000 ${
            isDarkMode
              ? scrolled
                ? "bg-purple-400/20 -top-10 left-1/5"
                : "bg-purple-300/15 -top-10 left-1/4"
              : scrolled
              ? "bg-blue-400/15 -top-10 left-1/5"
              : "bg-blue-300/10 -top-10 left-1/4"
          } animate-float-diamond`}
        />
        <div
          className={`absolute w-32 h-8 rounded-full transition-all duration-1000 ${
            isDarkMode
              ? scrolled
                ? "bg-pink-400/20 -top-4 right-1/4"
                : "bg-pink-300/15 -top-4 right-1/3"
              : scrolled
              ? "bg-sky-400/15 -top-4 right-1/4"
              : "bg-blue-200/10 -top-4 right-1/3"
          } animate-float-oval`}
        />
        <div
          className={`absolute w-16 h-16 rounded-full transition-all duration-1000 ${
            isDarkMode
              ? scrolled
                ? "bg-red-400/20 -top-8 right-1/6"
                : "bg-red-300/15 -top-8 right-1/5"
              : scrolled
              ? "bg-cyan-400/15 -top-8 right-1/6"
              : "bg-sky-200/10 -top-8 right-1/5"
          } animate-pulse-soft`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center space-x-1 group transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Animated logo with morphing effect */}
            <div className="relative">
              <div
                className={`w-10 h-10 transition-all duration-500 group-hover:scale-110 ${
                  isDarkMode
                    ? scrolled
                      ? "bg-gradient-to-br from-purple-600 to-pink-600"
                      : "bg-gradient-to-br from-purple-500 to-pink-500"
                    : scrolled
                    ? "bg-gradient-to-br from-blue-600 to-cyan-600"
                    : "bg-gradient-to-br from-blue-200 to-sky-300"
                } rounded-2xl relative overflow-hidden transform rotate-45 group-hover:rotate-180`}
              >
                <div className="absolute inset-1 bg-white rounded-xl transform -rotate-45 flex items-center justify-center">
                  <span
                    className={`font-black text-sm transition-colors duration-500 ${
                      isDarkMode
                        ? scrolled
                          ? "text-purple-600"
                          : "text-purple-600"
                        : scrolled
                        ? "text-blue-600"
                        : "text-blue-700"
                    }`}
                  >
                    H
                  </span>
                </div>
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </div>

            <div className="flex flex-col">
              <span
                className={`font-bold text-xl transition-all duration-500 ${
                  scrolled ? "text-white" : "text-white drop-shadow-lg"
                } group-hover:scale-105 relative`}
              >
                HarvestHub
                {/* Animated underline */}
                <div
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-500 ${
                    isDarkMode
                      ? scrolled
                        ? "bg-gradient-to-r from-purple-400 to-pink-400"
                        : "bg-gradient-to-r from-purple-300 to-pink-300"
                      : scrolled
                      ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                      : "bg-gradient-to-r from-blue-200 to-sky-200"
                  } w-0 group-hover:w-full`}
                />
              </span>
              <span
                className={`text-xs font-medium transition-colors duration-500 ${
                  isDarkMode
                    ? scrolled
                      ? "text-purple-200"
                      : "text-purple-100"
                    : scrolled
                    ? "text-blue-200"
                    : "text-blue-100"
                }`}
              >
                Fresh & Natural
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Floating Pill Design */}
          <div className="hidden lg:flex items-center">
            <div
              className={`flex items-center p-1.5 rounded-full transition-all duration-500 ${
                isDarkMode
                  ? scrolled
                    ? "bg-gray-800 border border-gray-700/50 shadow-lg"
                    : "bg-black/40 border border-purple-500/30"
                  : scrolled
                  ? "bg-slate-800 border border-slate-700/50 shadow-lg"
                  : "bg-white/30 border border-white/30"
              }`}
            >
              {authNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-6 py-2.5 mx-1 rounded-full font-medium text-sm transition-all duration-500 group ${
                    isActive(item.path)
                      ? isDarkMode
                        ? scrolled
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/25 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105"
                        : scrolled
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                        : "bg-gradient-to-r from-blue-200 to-sky-300 text-blue-900 shadow-lg shadow-blue-200/25 scale-105"
                      : isDarkMode
                      ? scrolled
                        ? "text-purple-200 hover:bg-gray-700/60 hover:scale-105 hover:text-white"
                        : "text-white hover:bg-purple-500/20 hover:scale-105"
                      : scrolled
                      ? "text-blue-200 hover:bg-slate-700/60 hover:scale-105 hover:text-white"
                      : "text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>

                  {/* Ripple effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  {/* Magnetic effect indicator */}
                  {!isActive(item.path) && (
                    <div
                      className={`absolute -inset-1 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                        scrolled ? "bg-blue-400/20" : "bg-blue-200/20"
                      } blur-sm`}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Login/User Menu */}
          <div className="flex items-center space-x-5">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileMenu(!showProfileMenu);
                      }}
                      className={`flex items-center space-x-3 p-2 rounded-2xl transition-all duration-500 group transform hover:scale-105 ${
                        scrolled
                          ? "bg-slate-800 hover:bg-slate-700 border border-slate-700/50"
                          : "bg-white/30 hover:bg-white/40 border border-white/30"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-all duration-500 group-hover:scale-110 ${
                          scrolled
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/25"
                            : "bg-gradient-to-r from-blue-300 to-sky-400 shadow-lg shadow-blue-300/25"
                        }`}
                      >
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`hidden lg:block font-medium text-sm transition-colors duration-500 ${
                          scrolled
                            ? "text-blue-200 group-hover:text-white"
                            : "text-white group-hover:text-blue-100"
                        }`}
                      >
                        {user?.name}
                      </span>
                      <svg
                        className={`hidden lg:block h-4 w-4 transition-all duration-500 group-hover:rotate-180 ${
                          scrolled ? "text-blue-300" : "text-blue-100"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <svg
                            className="mr-3 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          My Profile
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <svg
                            className="mr-3 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          My Orders
                        </Link>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <svg
                            className="mr-3 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          My Profile
                        </Link>

                        <Link
                          to="/addresses"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <svg
                            className="mr-3 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Addresses
                        </Link>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <svg
                              className="mr-3 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center space-x-3">
                    <Link
                      to="/login"
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-500 hover:scale-105 ${
                        scrolled
                          ? "text-blue-200 hover:text-white hover:bg-slate-700/60"
                          : "text-white hover:text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`px-6 py-2.5 rounded-xl font-medium text-white transition-all duration-500 transform hover:scale-105 shadow-lg ${
                        scrolled
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-600/25 hover:shadow-blue-600/40"
                          : "bg-gradient-to-r from-blue-200 to-sky-300 hover:from-blue-300 hover:to-sky-400 shadow-blue-200/25 hover:shadow-blue-200/40 text-blue-900"
                      }`}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`relative p-3.5 rounded-2xl transition-all duration-500 group transform hover:scale-110 mr-3 ${
                isDarkMode
                  ? scrolled
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
                    : "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40"
                  : scrolled
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              }`}
            >
              {isDarkMode ? (
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}

              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </button>

            {/* Floating Cart Button */}
            <Link
              to="/cart"
              className={`relative p-3.5 rounded-2xl transition-all duration-500 group transform hover:scale-110 ${
                scrolled
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                  : "bg-gradient-to-r from-blue-300 to-sky-400 shadow-lg shadow-blue-300/25 hover:shadow-blue-300/40"
              }`}
            >
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>

              {/* Dynamic cart count with pulse animation */}
              {cartCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 h-6 w-6 text-white text-xs font-bold rounded-full flex items-center justify-center transition-all duration-500 animate-pulse ${
                    scrolled
                      ? "bg-red-500 shadow-red-500/50"
                      : "bg-orange-500 shadow-orange-500/50"
                  } shadow-lg`}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}

              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ml-3 p-3 rounded-2xl transition-all duration-500 transform hover:scale-110 ${
                scrolled
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  : "bg-gradient-to-r from-blue-300 to-sky-400 text-white"
              }`}
            >
              <svg
                className="h-5 w-5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 transition-all duration-500"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 right-0 h-full w-5/6 max-w-sm bg-white shadow-2xl transform transition-transform duration-500 ease-in-out z-50 border-l border-gray-200/50">
            {/* Mobile Header with gradient */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600" />
              <div className="relative flex items-center justify-between p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="font-black text-lg">H</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold">HarvestHub</span>
                    <p className="text-xs opacity-80">Fresh & Natural</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl transition-colors hover:bg-white/20"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="mt-6 px-4 space-y-3">
              {authNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "bg-gray-50/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="mt-8 px-4 pb-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {user?.name}
                      </p>
                      <p className="text-gray-600 text-sm">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center p-3 rounded-xl transition-all duration-300 text-gray-700 hover:bg-blue-50"
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center p-3 rounded-xl transition-all duration-300 text-red-600 hover:bg-red-50"
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 px-4 pb-6 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full p-4 text-center rounded-2xl border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full p-4 text-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-blue-600/25 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes float-slow {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes float-slower {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
};
