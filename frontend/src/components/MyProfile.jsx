import {
  BellIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  CreditCardIcon,
  EnvelopeIcon,
  KeyIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Footer from "./Footer";
import { Navbar } from "./Navbar";

const MyProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        updateUser(result.data.user);
        setIsEditing(false);
        // Success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
        notification.textContent = "Profile updated successfully!";
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      notification.textContent = "Failed to update profile. Please try again.";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to view and manage your profile.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Login
            </button>
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
        className={`min-h-screen pt-24 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100"
        }`}
      >
        {/* Hero Section */}
        <div
          className={`relative text-white ${
            isDarkMode
              ? "bg-gradient-to-r from-purple-800 to-pink-800"
              : "bg-gradient-to-r from-emerald-600 to-teal-600"
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${
                    isDarkMode
                      ? "bg-gray-800 border-2 border-purple-500"
                      : "bg-white"
                  }`}
                >
                  <UserIcon
                    className={`w-16 h-16 ${
                      isDarkMode ? "text-purple-400" : "text-emerald-600"
                    }`}
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <CameraIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">
                  {user.name || "Welcome"}
                </h1>
                <p
                  className={`text-lg mb-1 ${
                    isDarkMode ? "text-purple-100" : "text-emerald-100"
                  }`}
                >
                  {user.email}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-purple-200" : "text-emerald-200"
                  }`}
                >
                  Member since{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <div className="flex items-center justify-center md:justify-start mt-3 space-x-4">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-300 mr-1" />
                    <span className="text-sm">Premium Member</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheckIcon className="w-4 h-4 text-green-300 mr-1" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div
              className={`rounded-xl shadow-lg p-6 border-l-4 border-blue-500 ${
                isDarkMode ? "bg-gray-800 border-opacity-80" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <TruckIcon className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total Orders
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    24
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl shadow-lg p-6 border-l-4 border-green-500 ${
                isDarkMode ? "bg-gray-800 border-opacity-80" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <CreditCardIcon className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total Spent
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ₹12,450
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl shadow-lg p-6 border-l-4 border-purple-500 ${
                isDarkMode ? "bg-gray-800 border-opacity-80" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <ClockIcon className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Last Order
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    2 days
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 ${
                isDarkMode ? "bg-gray-800 border-opacity-80" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <StarIcon className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Loyalty Points
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    1,240
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            className={`rounded-2xl shadow-xl overflow-hidden ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "personal", label: "Personal Info", icon: UserIcon },
                  { id: "security", label: "Security", icon: ShieldCheckIcon },
                  { id: "preferences", label: "Preferences", icon: BellIcon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? isDarkMode
                          ? "border-purple-500 text-purple-400"
                          : "border-emerald-500 text-emerald-600"
                        : isDarkMode
                        ? "border-transparent text-gray-400 hover:text-gray-300"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === "personal" && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2
                        className={`text-2xl font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Personal Information
                      </h2>
                      <p
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Manage your personal details and contact information
                      </p>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <PencilIcon className="w-5 h-5" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg disabled:opacity-50 transition-all duration-200"
                        >
                          <CheckIcon className="w-5 h-5" />
                          <span>{loading ? "Saving..." : "Save Changes"}</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all duration-200"
                        >
                          <XMarkIcon className="w-5 h-5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Name */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <UserIcon className="w-5 h-5 mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                          {user.name || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          placeholder="Enter your email address"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                          {user.email || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <PhoneIcon className="w-5 h-5 mr-2" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                          {user.phone || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <MapPinIcon className="w-5 h-5 mr-2" />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors"
                          placeholder="Enter your address"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 min-h-[100px]">
                          {user.address || "Not provided"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Security Settings
                    </h2>
                    <p className="text-gray-600">
                      Manage your account security and privacy settings
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-lg p-3 mr-4">
                            <KeyIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Password
                            </h3>
                            <p className="text-gray-600">
                              Last updated: Not available
                            </p>
                          </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors">
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-lg p-3 mr-4">
                            <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-gray-600">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-purple-100 rounded-lg p-3 mr-4">
                            <ClockIcon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Login History
                            </h3>
                            <p className="text-gray-600">
                              View your recent login activity
                            </p>
                          </div>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-colors">
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Preferences
                    </h2>
                    <p className="text-gray-600">
                      Customize your shopping experience and notifications
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              Order Updates
                            </p>
                            <p className="text-sm text-gray-600">
                              Get notified about your order status
                            </p>
                          </div>
                          <button className="bg-emerald-600 w-12 h-6 rounded-full relative">
                            <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              Promotional Offers
                            </p>
                            <p className="text-sm text-gray-600">
                              Receive exclusive deals and discounts
                            </p>
                          </div>
                          <button className="bg-emerald-600 w-12 h-6 rounded-full relative">
                            <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              Weekly Newsletter
                            </p>
                            <p className="text-sm text-gray-600">
                              Stay updated with fresh arrivals
                            </p>
                          </div>
                          <button className="bg-gray-300 w-12 h-6 rounded-full relative">
                            <div className="bg-white w-5 h-5 rounded-full absolute left-0.5 top-0.5"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyProfile;
