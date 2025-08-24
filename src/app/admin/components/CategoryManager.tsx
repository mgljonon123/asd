"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Edit, Trash2, Tag, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import ProductModal from "../../components/ProductModal";
import { Product } from "../../types/product";
import { useAdminData } from "../context/AdminDataContext";

interface Category {
  id: string;
  name: string;
  description: string;
  type: "CAMERA" | "ALARM";
  segment?: "RESIDENTIAL" | "COMPANY";
  createdAt: string;
  updatedAt: string;
}

export default function CategoryManager() {
  const {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory
  } = useAdminData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "CAMERA" as "CAMERA" | "ALARM",
    segment: "RESIDENTIAL" as "RESIDENTIAL" | "COMPANY",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "CAMERA" | "ALARM">("ALL");
  const [filterSegment, setFilterSegment] = useState<"ALL" | "RESIDENTIAL" | "COMPANY">("ALL");

  // Memoized filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === "ALL" || category.type === filterType;
      const matchesSegment = filterSegment === "ALL" || category.segment === filterSegment;
      
      return matchesSearch && matchesType && matchesSegment;
    });
  }, [categories, searchQuery, filterType, filterSegment]);

  // Memoized form handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        type: "CAMERA",
        segment: "RESIDENTIAL",
      });
      setEditingCategory(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  }, [formData, editingCategory, addCategory, updateCategory]);

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      type: category.type,
      segment: category.segment || "RESIDENTIAL",
    });
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This will also delete all products in this category.")) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  }, [deleteCategory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search categories..."
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
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Category Icon */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 flex items-center justify-center">
              <Tag className="w-16 h-16 text-white" />
            </div>

            {/* Category Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {category.type} • {category.segment}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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
      {filteredCategories.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterType !== "ALL" || filterSegment !== "ALL"
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first category"}
          </p>
          {!searchQuery && filterType === "ALL" && filterSegment === "ALL" && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
            >
              Add Category
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-6">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
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
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingCategory(null);
                  setFormData({
                    name: "",
                    description: "",
                    type: "CAMERA",
                    segment: "RESIDENTIAL",
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
