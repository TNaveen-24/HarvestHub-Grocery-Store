import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { Navbar } from "../components/Navbar.jsx";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const orderData = location.state?.orderData;

  const [currentTime] = useState(() => new Date());
  const [deliveryDate] = useState(
    () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  ); // 2 days from now

  useEffect(() => {
    // Clear cart from localStorage (in real app, this would be handled by cart context)
    localStorage.removeItem("cart");
  }, []);

  if (!orderData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h1>
            <Link
              to="/"
              className="text-sky-600 hover:text-sky-700 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8 print:hidden">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your order. Your fresh groceries are on their way!
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order #{orderId}
                </h2>
                <p className="text-gray-600">
                  Placed on {formatDate(currentTime)} at{" "}
                  {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <Link
                  to="/orders"
                  className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>View All Orders</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:hidden">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ClockIcon className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Expected Delivery
                    </h3>
                    <p className="text-green-800">{formatDate(deliveryDate)}</p>
                    <p className="text-sm text-green-700">
                      Between 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Delivery Address
                    </h3>
                    <p className="text-blue-800">
                      {orderData.deliveryAddress.firstName}{" "}
                      {orderData.deliveryAddress.lastName}
                    </p>
                    <p className="text-sm text-blue-700">
                      {orderData.deliveryAddress.address}
                      {orderData.deliveryAddress.apartment &&
                        `, ${orderData.deliveryAddress.apartment}`}
                    </p>
                    <p className="text-sm text-blue-700">
                      {orderData.deliveryAddress.city},{" "}
                      {orderData.deliveryAddress.state}{" "}
                      {orderData.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h3>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    ₹
                    {(
                      orderData.total -
                      40 -
                      Math.round(orderData.total * 0.15)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹40.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{Math.round(orderData.total * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-300">
                  <span>Total Paid</span>
                  <span>₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What happens next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Order Confirmed
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Your order has been received and is being processed
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Preparing Your Order
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Our team is carefully selecting and packing your fresh
                    groceries
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Out for Delivery
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Your order will be dispatched and delivered to your doorstep
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 print:hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-6 h-6 text-sky-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Customer Support
                  </p>
                  <p className="text-gray-600">+91 1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <p className="text-gray-600">support@harvesthub.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-8 print:hidden">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Continue Shopping</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
};

export default OrderConfirmation;
