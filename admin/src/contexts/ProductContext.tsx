import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { useApi } from "./ApiContext";
import { useNotification } from "./NotificationContext";
import { useUser } from "./UserContext";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
  features?: string[];
}

interface ProductContextType {
  products: Product[];
  loadingProducts: boolean;
  fetchProductsForAdmin: () => void;
  createProduct: (product: Partial<Product> | FormData) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product> | FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  const { apiUrl } = useApi();
  const { error, success } = useNotification();
  const { token } = useUser(); // for Authorization header

  // Fetch all products
  const fetchProductsForAdmin = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${apiUrl}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data || []);
    } catch (err: any) {
      console.error("Products fetch error:", err);
      setProducts([]);
      error("Unable to load products. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Create a new product
  const createProduct = async (product: Partial<Product> | FormData) => {
    try {
      const isFormData = product instanceof FormData;
      const res = await axios.post(`${apiUrl}/api/products/create/`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData && { "Content-Type": "multipart/form-data" }),
        },
      });

      // Make sure we have all expected fields, fallback to defaults
      const newProduct: Product = {
        _id: res.data._id || "",
        name: res.data.name || "",
        category: res.data.category || "",
        price: res.data.price || 0,
        stock: res.data.stock || 0,
        description: res.data.description || "",
        features: res.data.features || [],
        image_url: res.data.image_url || "",
      };

      setProducts((prev) => [...prev, newProduct]);
      success("Product created successfully!");
    } catch (err: any) {
      console.error("Create product error:", err);
      error("Failed to create product.");
    }
  };



  // Update an existing product
  const updateProduct = async (id: string, updates: Partial<Product> | FormData) => {
    try {
      const isFormData = updates instanceof FormData;
      const res = await axios.put(`${apiUrl}/api/products/${id}/update/`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData && { "Content-Type": "multipart/form-data" }),
        },
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...res.data } : p))
      );
      success("Product updated successfully!");
    } catch (err: any) {
      console.error("Update product error:", err);
      error("Failed to update product.");
    }
  };

  // Delete a product
  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/api/products/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      success("Product deleted successfully!");
    } catch (err: any) {
      console.error("Delete product error:", err);
      error("Failed to delete product.");
    }
  };

  // Get a single product
  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      const res = await axios.get(`${apiUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as Product;
    } catch (err: any) {
      console.error("Get product error:", err);
      error("Failed to load product.");
      return null;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loadingProducts,
        fetchProductsForAdmin,
        createProduct,
        updateProduct,
        deleteProduct,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used inside ProductProvider");
  return context;
};