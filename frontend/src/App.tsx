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
import { ApiProvider } from "./contexts/ApiContext";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import { UserProvider } from "./contexts/UserContext";
import Orders from "./pages/Orders";
import ProtectedRoute from "./lib/ProtectedRoute";
import { ProductProvider } from "./contexts/ProductContext";
import { OrderProvider } from "./contexts/OrderContext";
import Settings from "./pages/Settings";


const queryClient = new QueryClient();


const AppRoutes = () => {
  const location = useLocation(); // Now safe because inside <BrowserRouter>

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="page-fade"
        timeout={800}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          <Route path="/reset-password" element={<LoginModal onClose={() => window.location.href = "/"} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginOpen = () => setIsLoginModalOpen(true);
  const handleLoginClose = () => setIsLoginModalOpen(false);


  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <NotificationProvider>
          <UserProvider>
            <CartProvider>
              <ProductProvider>
                <OrderProvider>
                  <BrowserRouter>
                    <div className="app-container">
                      <Navbar onLoginOpen={handleLoginOpen}/>

                      {isLoginModalOpen && (
                        <LoginModal onClose={handleLoginClose}/>
                      )}
                      <main className="main-content">
                        <AppRoutes />
                      </main>
                      <Footer />
                    </div>
                  </BrowserRouter>
                </OrderProvider>
              </ProductProvider>
            </CartProvider>
          </UserProvider>
        </NotificationProvider>
      </ApiProvider>
    </QueryClientProvider>
  );
};

export default App;
