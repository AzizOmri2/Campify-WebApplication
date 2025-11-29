import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import './styles/main.css';
import { useState } from "react";
import LoginModal from "./components/LoginModal";
import { NotificationProvider } from "./contexts/NotificationContext";

const queryClient = new QueryClient();

const App = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar onLoginOpen={() => setLoginOpen(true)} />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
            </div>
          </BrowserRouter>
        </CartProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;
