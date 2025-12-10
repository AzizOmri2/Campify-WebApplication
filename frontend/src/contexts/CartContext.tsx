import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';
import { useApi } from './ApiContext';
import axios from 'axios';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  fetchCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, error } = useNotification();
  const { user, token } = useUser();
  const { apiUrl } = useApi();
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('campify-cart');
    return saved ? JSON.parse(saved) : [];
  });


  

  // Fetch cart from backend when user logs in
  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/users/cart/${user.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items || []);
    } catch (err: any) {
      error('Unable to retrieve your cart. Please try again');
    } finally {
      setLoading(false); // stop loading
    }
  };

  // Fetch cart when user logs in or logs out
  useEffect(() => {
    if (!user) {
      setCart([]); // clear cart state
      localStorage.removeItem('campify-cart'); // remove from localStorage
    } else {
      fetchCart(); // fetch from backend
    }
  }, [user]); // only depend on user, NOT cart

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) { // only save if there are items
      localStorage.setItem('campify-cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    if (!user) return error('Please log in to add items to your cart.');

    try {
      const res = await axios.post(`${apiUrl}/api/users/cart/${user.id}/add/`, { product_id: product._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Merge backend items with current product details (for immediate display)
      const updatedCart = res.data.items.map(item => {
        if (item._id === product._id) {
          return { ...item, name: product.name, price: product.price, image: product.image };
        }
        return item;
      });

      setCart(updatedCart);
      success(`Great! ${product.name} has been added to your cart`);
    } catch (err: any) {
      error('Unable to add this item to your cart. Please try again.');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return error('Please log in to remove items from your cart.');

    try {
      const res = await axios.delete(`${apiUrl}/api/users/cart/${user.id}/remove/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id: id },
      });
      
      // Optionally, merge current product info if needed
      const updatedCart = res.data.items.map(item => {
        const existing = cart.find(c => c._id === item._id);
        if (existing) return { ...item, name: existing.name, price: existing.price, image: existing.image };
        return item;
      });

      setCart(updatedCart);
      success('Item has been successfully removed from your cart.');
    } catch (err: any) {
      error('Unable to remove this item from your cart. Please try again.');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return error('Please log in to update your cart.');

    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    try {
      const res = await axios.put(`${apiUrl}/api/users/cart/${user.id}/update/`, { product_id: id, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items);
    } catch (err: any) {
      error('Unable to update item quantity. Please try again.');
    }
  };

  const clearCart = async () => {
    if (!user) return error('Please log in to clear your cart.');

    try {
      const res = await axios.delete(`${apiUrl}/api/users/cart/${user.id}/clear/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      success('Your cart is now empty.');
    } catch (err: any) {
      error('Unable to clear your cart. Please try again.');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};