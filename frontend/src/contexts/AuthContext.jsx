import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Set token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token
        localStorage.setItem("token", token);

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        setIsAuthenticated(true);

        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/register", userData);

      if (response.data.success) {
        // Note: User may need to verify email before being fully authenticated
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      throw new Error(message);
    }
  };

  const resetPassword = async (resetToken, password, confirmPassword) => {
    try {
      const response = await axios.put(`/auth/reset-password/${resetToken}`, {
        password,
        confirmPassword,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token and authenticate user
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        setIsAuthenticated(true);

        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      throw new Error(message);
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put("/auth/update-password", {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Password update failed";
      throw new Error(message);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put("/auth/profile", userData);

      if (response.data.success) {
        setUser(response.data.data.user);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      throw new Error(message);
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Email verification failed";
      throw new Error(message);
    }
  };

  const resendVerification = async () => {
    try {
      const response = await axios.post("/auth/resend-verification");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to resend verification email";
      throw new Error(message);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    updateUser,
    verifyEmail,
    resendVerification,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
