"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Types
interface Category {
  id: string;
  name: string;
  type: "CAMERA" | "ALARM";
  segment?: "RESIDENTIAL" | "COMPANY";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Company {
  id: string;
  name: string;
  contactInfo: string;
  phoneNumber: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  type: "CAMERA" | "ALARM";
  categoryId: string;
  category: { name: string; segment?: "RESIDENTIAL" | "COMPANY" };
  companyId: string;
  company: { name: string };
  images: string[];
  inStock: boolean;
  stockStatus: "AVAILABLE" | "OUT_OF_STOCK";
  createdAt: string;
  updatedAt: string;
}

interface AdminDataContextType {
  // Data
  categories: Category[];
  companies: Company[];
  products: Product[];
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshCompanies: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  
  // Mutations
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<Company>;
  deleteCompany: (id: string) => Promise<void>;
  
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'company'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Computed values
  getCategoryById: (id: string) => Category | undefined;
  getCompanyById: (id: string) => Company | undefined;
  getProductById: (id: string) => Product | undefined;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch all data on mount
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catRes, compRes, prodRes] = await Promise.all([
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/companies", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" }),
      ]);

      if (!catRes.ok || !compRes.ok || !prodRes.ok) {
        throw new Error("Failed to fetch one or more resources");
      }

      const [catData, compData, prodData] = await Promise.all([
        catRes.json(),
        compRes.json(),
        prodRes.json(),
      ]);

      setCategories(catData as Category[]);
      setCompanies(compData as Company[]);
      setProducts((prodData as any[]).map((p) => ({
        ...p,
        price: Number(p.price),
      })) as Product[]);
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh functions
  const refreshData = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCategories(data as Category[]);
      }
    } catch (error) {
      console.error("Error refreshing categories:", error);
    }
  }, []);

  const refreshCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/companies", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data as Company[]);
      }
    } catch (error) {
      console.error("Error refreshing companies:", error);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProducts((data as any[]).map((p) => ({
          ...p,
          price: Number(p.price),
        })) as Product[]);
      }
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  }, []);

  // Category mutations
  const addCategory = useCallback(async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    
    if (!res.ok) throw new Error("Failed to create category");
    
    const newCategory = await res.json();
    setCategories(prev => [newCategory, ...prev]);
    return newCategory;
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    
    if (!res.ok) throw new Error("Failed to update category");
    
    const updatedCategory = await res.json();
    setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
    return updatedCategory;
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    
    if (!res.ok) throw new Error("Failed to delete category");
    
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Also remove products that reference this category
    setProducts(prev => prev.filter(prod => prod.categoryId !== id));
  }, []);

  // Company mutations
  const addCompany = useCallback(async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    });
    
    if (!res.ok) throw new Error("Failed to create company");
    
    const newCompany = await res.json();
    setCompanies(prev => [newCompany, ...prev]);
    return newCompany;
  }, []);

  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    const res = await fetch(`/api/companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    
    if (!res.ok) throw new Error("Failed to update company");
    
    const updatedCompany = await res.json();
    setCompanies(prev => prev.map(comp => comp.id === id ? updatedCompany : comp));
    return updatedCompany;
  }, []);

  const deleteCompany = useCallback(async (id: string) => {
    const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
    
    if (!res.ok) throw new Error("Failed to delete company");
    
    setCompanies(prev => prev.filter(comp => comp.id !== id));
    // Also remove products that reference this company
    setProducts(prev => prev.filter(prod => prod.companyId !== id));
  }, []);

  // Product mutations
  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'company'>) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    
    if (!res.ok) throw new Error("Failed to create product");
    
    const newProduct = await res.json();
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    
    if (!res.ok) throw new Error("Failed to update product");
    
    const updatedProduct = await res.json();
    setProducts(prev => prev.map(prod => prod.id === id ? updatedProduct : prod));
    return updatedProduct;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    
    if (!res.ok) throw new Error("Failed to delete product");
    
    setProducts(prev => prev.filter(prod => prod.id !== id));
  }, []);

  // Computed values
  const getCategoryById = useCallback((id: string) => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

  const getCompanyById = useCallback((id: string) => {
    return companies.find(comp => comp.id === id);
  }, [companies]);

  const getProductById = useCallback((id: string) => {
    return products.find(prod => prod.id === id);
  }, [products]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    categories,
    companies,
    products,
    isLoading,
    isInitialized,
    refreshData,
    refreshCategories,
    refreshCompanies,
    refreshProducts,
    addCategory,
    updateCategory,
    deleteCategory,
    addCompany,
    updateCompany,
    deleteCompany,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryById,
    getCompanyById,
    getProductById,
  }), [
    categories,
    companies,
    products,
    isLoading,
    isInitialized,
    refreshData,
    refreshCategories,
    refreshCompanies,
    refreshProducts,
    addCategory,
    updateCategory,
    deleteCategory,
    addCompany,
    updateCompany,
    deleteCompany,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryById,
    getCompanyById,
    getProductById,
  ]);

  return (
    <AdminDataContext.Provider value={contextValue}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}

