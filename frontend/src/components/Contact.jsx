import {
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import Footer from "./Footer";
import { Navbar } from "./Navbar";

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: "Visit Our Store",
      details: [
        "HarvestHub Main Office",
        "Block A, Tech Park",
        "Sector 125, Noida, UP 201303",
        "India",
      ],
    },
    {
      icon: PhoneIcon,
      title: "Call Us",
      details: [
        "Customer Service: +91 9876543210",
        "Orders & Delivery: +91 9876543211",
        "Corporate: +91 9876543212",
      ],
    },
    {
      icon: EnvelopeIcon,
      title: "Email Us",
      details: [
        "support@harvesthub.com",
        "orders@harvesthub.com",
        "info@harvesthub.com",
      ],
    },
    {
      icon: ClockIcon,
      title: "Business Hours",
      details: [
        "Monday - Friday: 6:00 AM - 11:00 PM",
        "Saturday: 6:00 AM - 12:00 AM",
        "Sunday: 7:00 AM - 10:00 PM",
        "24/7 Online Support",
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: "general",
      });

      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800"
            : "bg-gradient-to-b from-sky-50 to-white"
        }`}
      >
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1
              className={`text-4xl md:text-6xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Get in <span className="text-sky-600">Touch</span>
            </h1>
            <p
              className={`text-xl md:text-2xl max-w-3xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Have questions, feedback, or need assistance? We're here to help!
              Reach out to us through any of the channels below.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
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
                    <info.icon className="w-6 h-6 text-sky-600" />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <p
                        key={detailIndex}
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div
                className={`p-8 rounded-2xl shadow-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <h2
                  className={`text-3xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Send us a Message
                </h2>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                      Thank you! Your message has been sent successfully. We'll
                      get back to you within 24 hours.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                      Sorry, there was an error sending your message. Please try
                      again.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Full Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                            errors.name
                              ? "border-red-300"
                              : isDarkMode
                              ? "border-gray-600 bg-gray-800 text-white"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Email Address *
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                            errors.email
                              ? "border-red-300"
                              : isDarkMode
                              ? "border-gray-600 bg-gray-800 text-white"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                            isDarkMode
                              ? "border-gray-600 bg-gray-800 text-white"
                              : "border-gray-300"
                          }`}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                          isDarkMode
                            ? "border-gray-600 bg-gray-800 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="orders">Order Support</option>
                        <option value="delivery">Delivery Issues</option>
                        <option value="products">Product Questions</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                        errors.subject
                          ? "border-red-300"
                          : isDarkMode
                          ? "border-gray-600 bg-gray-800 text-white"
                          : "border-gray-300"
                      }`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                        errors.message
                          ? "border-red-300"
                          : isDarkMode
                          ? "border-gray-600 bg-gray-800 text-white"
                          : "border-gray-300"
                      }`}
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="space-y-8">
                <div>
                  <h2
                    className={`text-3xl font-bold mb-6 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    <div
                      className={`p-6 rounded-xl shadow-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        What are your delivery hours?
                      </h3>
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        We deliver from 6 AM to 11 PM on weekdays, 6 AM to 12 AM
                        on Saturday, and 7 AM to 10 PM on Sunday. Express
                        delivery is available for urgent orders.
                      </p>
                    </div>

                    <div
                      className={`p-6 rounded-xl shadow-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        How can I track my order?
                      </h3>
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Once your order is placed, you'll receive a tracking
                        link via SMS and email. You can also track your order in
                        real-time through our mobile app.
                      </p>
                    </div>

                    <div
                      className={`p-6 rounded-xl shadow-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        What payment methods do you accept?
                      </h3>
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        We accept all major credit/debit cards, UPI, net
                        banking, digital wallets, and cash on delivery for your
                        convenience.
                      </p>
                    </div>

                    <div
                      className={`p-6 rounded-xl shadow-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Is there a minimum order value?
                      </h3>
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Minimum order value is ₹199. Orders above ₹500 qualify
                        for free delivery. Delivery charges apply for orders
                        below the free delivery threshold.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Options */}
                <div className="bg-sky-600 p-6 rounded-xl text-white">
                  <h3 className="text-xl font-semibold mb-4">
                    Need Immediate Help?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                      <span>Live Chat (Available 24/7)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5" />
                      <span>Call: +91 9876543210</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5" />
                      <span>Email: support@harvesthub.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
