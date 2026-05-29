import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  InformationCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Orders = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const generateSampleOrders = useCallback(() => {
    const currentDate = new Date();
    const defaultAddress = {
      firstName: user?.name?.split(" ")[0] || "John",
      lastName: user?.name?.split(" ")[1] || "Doe",
      address: "123 Main Street, Downtown",
      city: "Mumbai",
      zipCode: "400001",
    };

    return [
      {
        orderId: `HH${Date.now().toString().slice(-6)}`,
        userId: user?.id || "guest",
        items: [
          {
            id: 1,
            name: "Fresh Red Apples",
            price: 150,
            quantity: 2,
            category: "Fruits",
            image: "🍎",
          },
          {
            id: 2,
            name: "Organic Bananas",
            price: 80,
            quantity: 1,
            category: "Fruits",
            image: "🍌",
          },
          {
            id: 3,
            name: "Fresh Whole Milk",
            price: 65,
            quantity: 1,
            category: "Dairy",
            image: "🥛",
          },
        ],
        subtotal: 445,
        tax: 40,
        deliveryFee: 30,
        total: 515,
        status: "delivered",
        orderDate: new Date(
          currentDate.getTime() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        deliveryDate: new Date(
          currentDate.getTime() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        paymentMethod: "Credit Card",
        deliveryAddress: defaultAddress,
      },
      {
        orderId: `HH${(Date.now() + 1000).toString().slice(-6)}`,
        userId: user?.id || "guest",
        items: [
          {
            id: 4,
            name: "Greek Yogurt",
            price: 120,
            quantity: 2,
            category: "Dairy",
            image: "🥛",
          },
          {
            id: 5,
            name: "Artisan Bread",
            price: 85,
            quantity: 1,
            category: "Bakery",
            image: "🍞",
          },
        ],
        subtotal: 325,
        tax: 29,
        deliveryFee: 0,
        total: 354,
        status: "shipped",
        orderDate: new Date(
          currentDate.getTime() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        deliveryDate: new Date(
          currentDate.getTime() + 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        paymentMethod: "UPI",
        deliveryAddress: defaultAddress,
      },
      {
        orderId: `HH${(Date.now() + 2000).toString().slice(-6)}`,
        userId: user?.id || "guest",
        items: [
          {
            id: 6,
            name: "Fresh Vegetable Mix",
            price: 200,
            quantity: 1,
            category: "Vegetables",
            image: "🥬",
          },
          {
            id: 7,
            name: "Premium Carrots",
            price: 75,
            quantity: 2,
            category: "Vegetables",
            image: "🥕",
          },
        ],
        subtotal: 350,
        tax: 32,
        deliveryFee: 25,
        total: 407,
        status: "processing",
        orderDate: new Date(
          currentDate.getTime() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        deliveryDate: new Date(
          currentDate.getTime() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        paymentMethod: "Cash on Delivery",
        deliveryAddress: defaultAddress,
      },
    ];
  }, [user]);

  useEffect(() => {
    const loadOrders = () => {
      setLoading(true);

      if (!isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const savedOrders = localStorage.getItem(
          `orders_${user?.id || "guest"}`
        );

        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          // Check if we have real orders (from checkout) vs sample orders
          const hasRealOrders = parsedOrders.some(
            (order) => order.orderId && !order.orderId.startsWith("HH")
          );

          if (parsedOrders.length === 0) {
            // No orders at all, add sample orders
            if (user?.id) {
              const sampleOrders = generateSampleOrders();
              setOrders(sampleOrders);
              localStorage.setItem(
                `orders_${user?.id || "guest"}`,
                JSON.stringify(sampleOrders)
              );
            } else {
              setOrders([]);
            }
          } else if (!hasRealOrders && parsedOrders.length > 0) {
            // Only sample orders exist, refresh them with new format
            const sampleOrders = generateSampleOrders();
            setOrders(sampleOrders);
            localStorage.setItem(
              `orders_${user?.id || "guest"}`,
              JSON.stringify(sampleOrders)
            );
          } else {
            // We have real orders, keep them
            setOrders(parsedOrders);
          }
        } else {
          // No localStorage data at all
          if (user?.id) {
            const sampleOrders = generateSampleOrders();
            setOrders(sampleOrders);
            localStorage.setItem(
              `orders_${user?.id || "guest"}`,
              JSON.stringify(sampleOrders)
            );
          } else {
            setOrders([]);
          }
        }
      } catch (error) {
        console.error("Error parsing orders:", error);
        setOrders([]);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    loadOrders();
  }, [user, isAuthenticated, generateSampleOrders]);

  const renderProductImage = (item) => {
    // Check if it's an emoji (sample data) or image path (real data)
    if (item.image && item.image.includes("/")) {
      // It's an image path, render as img tag
      return (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            // Fallback to emoji if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    } else {
      // It's an emoji or fallback, render as text
      return <span className="text-2xl">{item.image || "📦"}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case "processing":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XMarkIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.orderDate) - new Date(a.orderDate);
    } else if (sortBy === "oldest") {
      return new Date(a.orderDate) - new Date(b.orderDate);
    }
    return 0;
  });

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Please log in to view your orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You need to be logged in to access your order history.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Login to Your Account
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900"
            : "bg-gradient-to-br from-blue-50 via-white to-green-50"
        }`}
      >
        {/* Beautiful Header with Gradient */}
        <div
          className={`${
            isDarkMode
              ? "bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600"
              : "bg-gradient-to-r from-green-600 via-green-700 to-emerald-600"
          } relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <ShoppingBagIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Your Orders
              </h1>
              <p
                className={`text-xl max-w-2xl mx-auto ${
                  isDarkMode ? "text-purple-100" : "text-green-100"
                }`}
              >
                Track and manage all your delicious grocery orders in one
                beautiful place
              </p>
              <div className="mt-8 flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-white font-semibold">
                    {sortedOrders.length} Total Orders
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-4 ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-400 to-pink-400"
                : "bg-gradient-to-r from-green-400 to-emerald-400"
            }`}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 -mt-8">
          {loading ? (
            <div
              className={`${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-purple-600"
                  : "bg-gradient-to-br from-white to-blue-50 border border-blue-100"
              } rounded-2xl shadow-xl p-12`}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-spin">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  🛍️ Loading Your Orders
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Fetching your delicious order history...
                </p>
              </div>
              <div className="space-y-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`${
                        isDarkMode
                          ? "bg-gray-700 border border-gray-600"
                          : "bg-white border border-gray-200"
                      } rounded-2xl p-6 shadow-sm`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
                          <div className="space-y-2">
                            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
                        <div className="h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Beautiful Filters Card */}
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-100"
                } rounded-2xl shadow-lg p-8 mb-8 backdrop-blur-sm`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          />
                        </svg>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          Filter by Status
                        </label>
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className={`rounded-xl border-2 ${
                            isDarkMode
                              ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 hover:border-gray-500"
                              : "border-gray-200 bg-white focus:border-green-500 focus:ring-green-500 hover:border-gray-300"
                          } shadow-sm focus:ring-2 px-4 py-2 text-sm font-medium transition-all duration-200`}
                        >
                          <option value="all">All Orders</option>
                          <option value="delivered">✅ Delivered</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="processing">⏳ Processing</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-semibold ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } block mb-1`}
                        >
                          Sort Orders
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={`rounded-xl border-2 ${
                            isDarkMode
                              ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 hover:border-gray-500"
                              : "border-gray-200 bg-white focus:border-green-500 focus:ring-green-500 hover:border-gray-300"
                          } shadow-sm focus:ring-2 px-4 py-2 text-sm font-medium transition-all duration-200`}
                        >
                          <option value="newest">🆕 Newest First</option>
                          <option value="oldest">📅 Oldest First</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Stats Display */}
                  <div className="flex gap-4">
                    <div
                      className={`rounded-xl px-4 py-3 border ${
                        isDarkMode
                          ? "bg-gradient-to-r from-purple-900 to-pink-900 border-purple-600 text-purple-300"
                          : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                      }`}
                    >
                      <div
                        className={`text-xs font-medium uppercase tracking-wide ${
                          isDarkMode ? "text-purple-300" : "text-green-600"
                        }`}
                      >
                        Active Orders
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          isDarkMode ? "text-purple-100" : "text-green-700"
                        }`}
                      >
                        {
                          orders.filter((o) =>
                            ["processing", "shipped"].includes(o.status)
                          ).length
                        }
                      </div>
                    </div>
                    <div
                      className={`rounded-xl px-4 py-3 border ${
                        isDarkMode
                          ? "bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-600"
                          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      }`}
                    >
                      <div
                        className={`text-xs font-medium uppercase tracking-wide ${
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        Completed
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          isDarkMode ? "text-blue-100" : "text-blue-700"
                        }`}
                      >
                        {orders.filter((o) => o.status === "delivered").length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                {sortedOrders.length === 0 ? (
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-purple-600"
                        : "bg-gradient-to-br from-white to-blue-50 border border-blue-100"
                    } rounded-2xl shadow-xl p-12 text-center`}
                  >
                    <div
                      className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-2 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-purple-800 to-pink-800 border-purple-500"
                          : "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200"
                      }`}
                    >
                      <ShoppingBagIcon
                        className={`h-12 w-12 ${
                          isDarkMode ? "text-purple-300" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-2xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } mb-4`}
                    >
                      🛍️ No orders found
                    </h3>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } mb-8 max-w-md mx-auto`}
                    >
                      {filter === "all"
                        ? "Ready to start your fresh grocery journey? Discover amazing products waiting for you!"
                        : `No orders found with status: ${filter}. Try adjusting your filters.`}
                    </p>
                    <div className="space-y-4">
                      <Link
                        to="/products"
                        className={`inline-flex items-center px-8 py-4 border border-transparent shadow-lg text-lg font-semibold rounded-2xl text-white transform hover:scale-105 transition-all duration-200 ${
                          isDarkMode
                            ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        }`}
                      >
                        <ShoppingBagIcon className="mr-3 h-6 w-6" />
                        🌟 Start Shopping Now
                        <ArrowRightIcon className="ml-3 h-6 w-6" />
                      </Link>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Fresh groceries • Fast delivery • Great prices
                      </p>
                    </div>
                  </div>
                ) : (
                  sortedOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className={`group rounded-2xl shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden backdrop-blur-sm ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-600 hover:border-purple-500"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      {/* Beautiful gradient top border */}
                      <div
                        className={`h-2 bg-gradient-to-r ${
                          order.status === "delivered"
                            ? "from-green-400 to-emerald-500"
                            : order.status === "shipped"
                            ? "from-blue-400 to-indigo-500"
                            : order.status === "processing"
                            ? "from-yellow-400 to-orange-500"
                            : "from-gray-400 to-gray-500"
                        }`}
                      ></div>

                      <div className="p-6">
                        {/* Beautiful Order Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div className="flex items-center gap-3 mb-3 lg:mb-0">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                order.status === "delivered"
                                  ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200"
                                  : order.status === "shipped"
                                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-200"
                                  : order.status === "processing"
                                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200"
                                  : "bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-200"
                              }`}
                            >
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <h3
                                className={`text-lg font-bold ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                } mb-1`}
                              >
                                Order #{order.orderId}
                              </h3>
                              <div
                                className={`flex items-center gap-2 text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v4a2 2 0 002 2h4a2 2 0 002-2v-4M8 7h8m-8 0L7 8.5M16 7l1 1.5"
                                  />
                                </svg>
                                Placed on {formatDate(order.orderDate)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col lg:items-end gap-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-sm ${
                                  order.status === "delivered"
                                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                                    : order.status === "shipped"
                                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                                    : order.status === "processing"
                                    ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200"
                                    : "bg-gradient-to-r from-gray-100 to-gray-100 text-gray-800 border border-gray-200"
                                }`}
                              >
                                {order.status === "delivered" && "✅"}
                                {order.status === "shipped" && "🚚"}
                                {order.status === "processing" && "⏳"}
                                {order.status === "cancelled" && "❌"}
                                <span className="ml-1">{order.status}</span>
                              </span>
                            </div>
                            <div
                              className={`rounded-xl px-4 py-2 border ${
                                isDarkMode
                                  ? "bg-gradient-to-r from-gray-700 to-gray-600 border-gray-500"
                                  : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                              }`}
                            >
                              <span
                                className={`text-xs font-medium uppercase tracking-wide block ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Total Amount
                              </span>
                              <span
                                className={`text-2xl font-bold ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                ₹{order.total}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Beautiful Order Items Preview */}
                        <div
                          className={`rounded-xl p-6 mb-6 border ${
                            isDarkMode
                              ? "bg-gradient-to-r from-gray-700 to-gray-600 border-gray-500"
                              : "bg-gradient-to-r from-gray-50 to-white border-gray-100"
                          }`}
                        >
                          <h4
                            className={`text-lg font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            } mb-4 flex items-center gap-2`}
                          >
                            <svg
                              className={`w-5 h-5 ${
                                isDarkMode
                                  ? "text-purple-400"
                                  : "text-green-600"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                            Order Items
                          </h4>
                          <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div
                                  key={item.id}
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-3 shadow-lg hover:scale-110 transition-transform duration-200 overflow-hidden relative ${
                                    isDarkMode
                                      ? "bg-gradient-to-br from-gray-600 to-gray-500 border-gray-700"
                                      : "bg-gradient-to-br from-white to-gray-50 border-white"
                                  }`}
                                  style={{ zIndex: 10 - index }}
                                >
                                  {renderProductImage(item)}
                                  {/* Fallback emoji if image fails */}
                                  <span
                                    className="text-2xl absolute inset-0 flex items-center justify-center"
                                    style={{ display: "none" }}
                                  >
                                    {item.category === "Fruits"
                                      ? "🍎"
                                      : item.category === "Vegetables"
                                      ? "🥬"
                                      : item.category === "Dairy"
                                      ? "🥛"
                                      : item.category === "Bakery"
                                      ? "🍞"
                                      : item.category === "Meat"
                                      ? "🥩"
                                      : "📦"}
                                  </span>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold border-3 shadow-lg ${
                                    isDarkMode
                                      ? "bg-gradient-to-br from-purple-800 to-pink-800 text-purple-200 border-gray-700"
                                      : "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 border-white"
                                  }`}
                                >
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                    isDarkMode
                                      ? "bg-gradient-to-r from-purple-800 to-pink-800 text-purple-200 border-purple-600"
                                      : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                                  }`}
                                >
                                  {order.items.length} item
                                  {order.items.length > 1 ? "s" : ""}
                                </span>
                              </div>
                              <p
                                className={`text-sm font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                } mb-1`}
                              >
                                {order.items[0].name}
                                {order.items.length > 1 &&
                                  ` and ${
                                    order.items.length - 1
                                  } more delicious item${
                                    order.items.length > 2 ? "s" : ""
                                  }`}
                              </p>
                              <div
                                className={`flex items-center gap-4 text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  Fresh & Quality
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Carefully Packed
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div
                          className={`pt-4 ${
                            isDarkMode
                              ? "border-t border-gray-600"
                              : "border-t border-gray-200"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <TruckIcon className="h-4 w-4" />
                              {order.status === "delivered" ? (
                                <span
                                  className={`${
                                    isDarkMode
                                      ? "text-green-400"
                                      : "text-green-600"
                                  }`}
                                >
                                  Delivered on {formatDate(order.deliveryDate)}
                                </span>
                              ) : (
                                <span>
                                  Expected delivery:{" "}
                                  {formatDate(order.deliveryDate)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(order)}
                                className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  isDarkMode
                                    ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-purple-500"
                                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-green-500"
                                }`}
                              >
                                <EyeIcon className="mr-1 h-3 w-3" />
                                View Details
                              </button>
                              <Link
                                to="/products"
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  isDarkMode
                                    ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                }`}
                              >
                                Buy Again
                                <ArrowRightIcon className="ml-1 h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Beautiful Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div
            className={`relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-2xl rounded-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600"
                : "bg-gradient-to-br from-white to-blue-50"
            }`}
          >
            <div className="relative">
              {/* Beautiful Modal Header */}
              <div
                className={`rounded-2xl p-6 mb-6 text-white relative overflow-hidden ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-green-600 to-emerald-600"
                }`}
              >
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <ShoppingBagIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Order #{selectedOrder.orderId}
                      </h3>
                      <p
                        className={`${
                          isDarkMode ? "text-purple-100" : "text-green-100"
                        }`}
                      >
                        Complete order details and tracking
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-8 max-h-[70vh] overflow-y-auto px-2">
                {/* Beautiful Order Status */}
                <div
                  className={`rounded-2xl p-6 shadow-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          selectedOrder.status === "delivered"
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200"
                            : selectedOrder.status === "shipped"
                            ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-200"
                            : selectedOrder.status === "processing"
                            ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200"
                            : "bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-200"
                        }`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                      </div>
                      <div>
                        <h4
                          className={`text-xl font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          } mb-1`}
                        >
                          Order Status
                        </h4>
                        <p
                          className={`text-lg font-semibold ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } capitalize`}
                        >
                          {selectedOrder.status === "delivered" && "✅"}
                          {selectedOrder.status === "shipped" && "🚚"}
                          {selectedOrder.status === "processing" && "⏳"}
                          {selectedOrder.status === "cancelled" && "❌"}
                          <span className="ml-2">{selectedOrder.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium uppercase tracking-wide ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Total Amount
                      </p>
                      <p
                        className={`text-3xl font-bold bg-clip-text text-transparent ${
                          isDarkMode
                            ? "bg-gradient-to-r from-purple-400 to-pink-400"
                            : "bg-gradient-to-r from-green-600 to-emerald-600"
                        }`}
                      >
                        ₹{selectedOrder.total}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          isDarkMode
                            ? "border-gray-600 bg-gray-600"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden relative ${
                              isDarkMode ? "bg-gray-500" : "bg-gray-100"
                            }`}
                          >
                            {renderProductImage(item)}
                            {/* Fallback emoji if image fails */}
                            <span
                              className="text-xl absolute inset-0 flex items-center justify-center"
                              style={{ display: "none" }}
                            >
                              {item.category === "Fruits"
                                ? "🍎"
                                : item.category === "Vegetables"
                                ? "🥬"
                                : item.category === "Dairy"
                                ? "🥛"
                                : item.category === "Bakery"
                                ? "🍞"
                                : item.category === "Meat"
                                ? "🥩"
                                : "📦"}
                            </span>
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item.name}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Delivery Address
                  </h4>
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedOrder.deliveryAddress.firstName}{" "}
                      {selectedOrder.deliveryAddress.lastName}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {selectedOrder.deliveryAddress.address}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {selectedOrder.deliveryAddress.city},{" "}
                      {selectedOrder.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-3`}
                  >
                    Order Summary
                  </h4>
                  <div
                    className={`space-y-2 p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex justify-between text-sm ${
                        isDarkMode ? "text-gray-300" : ""
                      }`}
                    >
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    <div
                      className={`flex justify-between text-sm ${
                        isDarkMode ? "text-gray-300" : ""
                      }`}
                    >
                      <span>Tax</span>
                      <span>₹{selectedOrder.tax}</span>
                    </div>
                    <div
                      className={`flex justify-between text-sm ${
                        isDarkMode ? "text-gray-300" : ""
                      }`}
                    >
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee}</span>
                    </div>
                    <div
                      className={`pt-2 mt-2 ${
                        isDarkMode ? "border-t border-gray-500" : "border-t"
                      }`}
                    >
                      <div
                        className={`flex justify-between font-medium ${
                          isDarkMode ? "text-white" : ""
                        }`}
                      >
                        <span>Total</span>
                        <span>₹{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className={`px-4 py-2 text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-purple-500"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Orders;
