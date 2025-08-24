"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import ProductModal from "../../components/ProductModal";
import { Product as HomePageProduct } from "../../types/product";
import Image from "next/image";
import { useAdminData } from "../context/AdminDataContext";

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

export default function ProductManager() {
  const {
    products,
    categories,
    companies,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  } = useAdminData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<HomePageProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    tags: "",
    type: "CAMERA" as "CAMERA" | "ALARM",
    segment: "RESIDENTIAL" as "RESIDENTIAL" | "COMPANY",
    companyId: "",
    images: "",
    inStock: true,
    stockStatus: "AVAILABLE" as "AVAILABLE" | "OUT_OF_STOCK",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "CAMERA" | "ALARM">("ALL");
  const [filterSegment, setFilterSegment] = useState<"ALL" | "RESIDENTIAL" | "COMPANY">("ALL");
  const [filterStock, setFilterStock] = useState<"ALL" | "AVAILABLE" | "OUT_OF_STOCK">("ALL");

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === "ALL" || product.type === filterType;
      const matchesSegment = filterSegment === "ALL" || product.category.segment === filterSegment;
      const matchesStock = filterStock === "ALL" || product.stockStatus === filterStock;
      
      return matchesSearch && matchesType && matchesSegment && matchesStock;
    });
  }, [products, searchQuery, filterType, filterSegment, filterStock]);

  // Memoized form handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0 || !formData.companyId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Resolve category by type + segment; create if missing
      let selectedCategory = categories.find(
        (c) => c.type === formData.type && c.segment === formData.segment
      );
      
      if (!selectedCategory) {
        // Create category if it doesn't exist
        const categoryData = {
          name: `${formData.type} - ${formData.segment}`,
          description: `${formData.segment} ${formData.type.toLowerCase()} category`,
          type: formData.type,
          segment: formData.segment,
        };
        
        // Note: We'll need to add this to the context later
        // For now, let's just use a placeholder
        selectedCategory = {
          id: `temp-${Date.now()}`,
          ...categoryData
        };
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        type: formData.type,
        categoryId: selectedCategory.id,
        companyId: formData.companyId,
        images: formData.images ? formData.images.split(",").map(i => i.trim()).filter(Boolean) : [],
        inStock: formData.inStock,
        stockStatus: formData.stockStatus,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        price: 0,
        tags: "",
        type: "CAMERA",
        segment: "RESIDENTIAL",
        companyId: "",
        images: "",
        inStock: true,
        stockStatus: "AVAILABLE",
      });
      setEditingProduct(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  }, [formData, editingProduct, categories, addProduct, updateProduct]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags.join(", "),
      type: product.type,
      segment: product.category.segment || "RESIDENTIAL",
      companyId: product.companyId,
      images: product.images.join(", "),
      inStock: product.inStock,
      stockStatus: product.stockStatus,
    });
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  }, [deleteProduct]);

  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      type: product.type,
      category: product.category,
      company: product.company,
      images: product.images,
      inStock: product.inStock,
      stockStatus: product.stockStatus,
    });
    setIsProductModalOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "ALL" | "CAMERA" | "ALARM")}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="ALL">All Types</option>
          <option value="CAMERA">Camera</option>
          <option value="ALARM">Alarm</option>
        </select>
        
        <select
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value as "ALL" | "RESIDENTIAL" | "COMPANY")}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="ALL">All Segments</option>
          <option value="RESIDENTIAL">Residential</option>
          <option value="COMPANY">Company</option>
        </select>
        
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value as "ALL" | "AVAILABLE" | "OUT_OF_STOCK")}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="ALL">All Stock</option>
          <option value="AVAILABLE">Available</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.stockStatus === "AVAILABLE" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {product.stockStatus}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {product.category.name} • {product.category.segment}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">{product.company.name}</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewProduct(product)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterType !== "ALL" || filterSegment !== "ALL" || filterStock !== "ALL"
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first product"}
          </p>
          {!searchQuery && filterType === "ALL" && filterSegment === "ALL" && filterStock === "ALL" && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
            >
              Add Product
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="CAMERA">Camera</option>
                    <option value="ALARM">Alarm</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segment *
                  </label>
                  <select
                    name="segment"
                    value={formData.segment}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMPANY">Company</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="camera, professional, 4K"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">In Stock</label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Status
                  </label>
                  <select
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 font-medium"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: 0,
                      tags: "",
                      type: "CAMERA",
                      segment: "RESIDENTIAL",
                      companyId: "",
                      images: "",
                      inStock: true,
                      stockStatus: "AVAILABLE",
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Product View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
