import {
  ArrowLeftIcon,
  CreditCardIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Footer from "./Footer";
import { Navbar } from "./Navbar";

const Cart = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartItems([]);
      }
    }
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    const showNotification = (message, type = "success") => {
      const notification = document.createElement("div");
      notification.className = `fixed top-4 right-4 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white px-6 py-3 rounded-lg shadow-lg z-50`;
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${
              type === "success"
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
            }
          </svg>
          ${message}
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    };

    if (promoCode.toLowerCase() === "harvest10") {
      setPromoDiscount(10);
      setPromoApplied(true);
      showNotification("Promo code applied! You saved 10%");
    } else if (promoCode.toLowerCase() === "welcome20") {
      setPromoDiscount(20);
      setPromoApplied(true);
      showNotification("Promo code applied! You saved 20%");
    } else if (promoCode.toLowerCase() === "fresh5") {
      setPromoDiscount(5);
      setPromoApplied(true);
      showNotification("Promo code applied! You saved 5%");
    } else if (promoCode.trim() === "") {
      showNotification("Please enter a promo code", "error");
    } else {
      showNotification("Invalid promo code", "error");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * promoDiscount) / 100;
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const tax = (subtotal - discountAmount) * 0.05; // 5% tax
  const total = subtotal - discountAmount + deliveryFee + tax;

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          Please log in to continue with checkout
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      // Redirect to login after a brief delay
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (cartItems.length === 0) {
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Your cart is empty! Add some items first.
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      return;
    }

    // Navigate to checkout page
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div
          className={`min-h-screen flex items-center justify-center ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <div className="text-center">
            <ShoppingBagIcon
              className={`w-24 h-24 mx-auto mb-6 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Your cart is empty
            </h2>
            <p
              className={`mb-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Add some delicious items to your cart to get started!
            </p>
            <Link
              to="/products"
              className="bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors inline-flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
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
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        {/* Header */}
        <div
          className={`shadow-sm border-b ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <h1
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Shopping Cart
              </h1>
              <Link
                to="/products"
                className="text-sky-600 hover:text-sky-700 font-medium inline-flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className={`rounded-lg shadow-sm p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2
                  className={`text-xl font-semibold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Cart Items ({cartItems.length})
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-4 p-4 border rounded-lg ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200"
                      }`}
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {item.unit}
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ₹{item.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className={`p-1 rounded-lg border transition-colors ${
                            isDarkMode
                              ? "border-gray-600 hover:bg-gray-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span
                          className={`w-12 text-center font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className={`p-1 rounded-lg border transition-colors ${
                            isDarkMode
                              ? "border-gray-600 hover:bg-gray-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ₹{item.price * item.quantity}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div
                className={`rounded-lg shadow-sm p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Promo Code
                </h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Enter promo code (try: HARVEST10 or WELCOME20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300"
                    }`}
                    disabled={promoApplied}
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode.trim()}
                    className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    ✅ Promo code applied! You saved {promoDiscount}%
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className={`rounded-lg shadow-sm p-6 sticky top-8 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2
                  className={`text-xl font-semibold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Subtotal
                    </span>
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({promoDiscount}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Delivery Fee
                      {subtotal >= 500 && (
                        <span className="text-green-600 text-sm"> (Free!)</span>
                      )}
                    </span>
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Tax (5%)
                    </span>
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>

                  <hr
                    className={
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    }
                  />

                  <div className="flex justify-between text-lg font-bold">
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      Total
                    </span>
                    <span className="text-sky-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      isDarkMode ? "bg-sky-900/20" : "bg-sky-50"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-sky-400" : "text-sky-800"
                      }`}
                    >
                      Add ₹{(500 - subtotal).toFixed(2)} more to get free
                      delivery!
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sky-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </button>

                  {!isAuthenticated && (
                    <p className="text-sm text-gray-600 text-center">
                      <Link
                        to="/login"
                        className="text-sky-600 hover:underline"
                      >
                        Log in
                      </Link>{" "}
                      to continue with checkout
                    </p>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    🔒 Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
