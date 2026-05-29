import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./components/About.jsx";
import Cart from "./components/Cart.jsx";
import Contact from "./components/Contact.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Login from "./components/Login.jsx";
import MyProfile from "./components/MyProfile.jsx";
import ProductCatalog from "./components/ProductCatalog.jsx";
import Register from "./components/Register.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Checkout from "./pages/Checkout.jsx";
import Home from "./pages/Home.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import Orders from "./pages/Orders.jsx";

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<ProductCatalog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmation />}
              />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<MyProfile />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
