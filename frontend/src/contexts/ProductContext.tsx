import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiContext';
import { useNotification } from './NotificationContext';
import axios from 'axios';

export interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  description?: string;
  features?: string[];
}

interface ProductContextType {
  products: ProductType[];
  featuredProducts: ProductType[];
  loading: boolean;
  fetchProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiUrl } = useApi();
  const { error } = useNotification();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ProductType[]>(`${apiUrl}/api/products/`);
      setProducts(response.data || []);
    } catch (err: any) {
      setProducts([]); // Treat as empty list if failed
      error('We’re having trouble loading the products. Refresh or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [apiUrl]);

  const featuredProducts = products.slice(0, 4);

  return (
    <ProductContext.Provider value={{ products, featuredProducts, loading, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
