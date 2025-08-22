"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import ProductModal from "../../components/ProductModal";
import { Product } from "../../types/product";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [filterType, setFilterType] = useState<"ALL" | "CAMERA" | "ALARM">(
    "ALL"
  );
  const [filterSegment, setFilterSegment] = useState<
    "ALL" | "RESIDENTIAL" | "COMPANY"
  >("ALL");

  // Debug form data changes
  useEffect(() => {
    console.log("Category form data changed:", formData);
  }, [formData]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Category form submitted with data:", formData);
    console.log("Current categories:", categories);

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update category");
        const updated: Category = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to create category");
        const created: Category = await res.json();
        setCategories((prev) => [created, ...prev]);
      }
    } catch (error) {
      console.error(error);
      alert("Operation failed. See console for details.");
      return;
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type,
      segment: category.segment || "RESIDENTIAL",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      alert("Delete failed. See console for details.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "CAMERA",
      segment: "RESIDENTIAL",
    });
    setEditingCategory(null);
  };

  const showSampleProduct = () => {
    const sampleProduct: Product = {
      id: 1,
      name: "HD Dome Camera Pro",
      price: 450000,
      originalPrice: 550000,
      description: "1080p HD resolution with night vision and motion detection",
      features: ["1080p HD", "Night Vision", "Motion Detection"],
      badge: "Best Seller",
      badgeColor: "teal",
    };

    setSelectedProduct(sampleProduct);
    setIsProductModalOpen(true);
  };

  const getTypeIcon = (type: "CAMERA" | "ALARM") => {
    return type === "CAMERA" ? (
      <Package className="h-4 w-4" />
    ) : (
      <Tag className="h-4 w-4" />
    );
  };

  const getTypeColor = (type: "CAMERA" | "ALARM") => {
    return type === "CAMERA"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading categories...</div>
      </div>
    );
  }

  const filteredCategories = categories.filter((category) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      category.name.toLowerCase().includes(q) ||
      category.description.toLowerCase().includes(q);
    const matchesType = filterType === "ALL" || category.type === filterType;
    const matchesSeg =
      filterSegment === "ALL" || category.segment === filterSegment;
    return matchesSearch && matchesType && matchesSeg;
  });

  return (
    <div>
      <div className="space-y-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Manage Categories
          </h2>
          <p className="text-gray-600">
            Organize your products into logical categories
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or description..."
            className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "ALL" | "CAMERA" | "ALARM")
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-black"
          >
            <option value="ALL">All Types</option>
            <option value="CAMERA">Camera</option>
            <option value="ALARM">Alarm</option>
          </select>
          <select
            value={filterSegment}
            onChange={(e) =>
              setFilterSegment(
                e.target.value as "ALL" | "RESIDENTIAL" | "COMPANY"
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-black"
          >
            <option value="ALL">All Segments</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMPANY">Company</option>
          </select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </DialogTrigger>
            {isDialogOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <DialogContent className="sm:max-w-md w-full max-w-md bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8">
                  <div className="mb-4">
                    <DialogTitle>
                      {editingCategory ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Product Type
                      </label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "CAMERA" | "ALARM",
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="CAMERA">Camera</option>
                        <option value="ALARM">Alarm</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="segment"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Segment
                      </label>
                      <select
                        id="segment"
                        value={formData.segment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            segment: e.target.value as
                              | "RESIDENTIAL"
                              | "COMPANY",
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="RESIDENTIAL">Residential</option>
                        <option value="COMPANY">Company</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {editingCategory ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </div>
            )}
          </Dialog>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {filteredCategories.length} of {categories.length} categories
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="group relative rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute right-3 top-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 rounded-md bg-white/90 border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 rounded-md bg-white/90 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 w-full">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                            category.type
                          )}`}
                        >
                          {getTypeIcon(category.type)}
                          <span className="ml-1">{category.type}</span>
                        </span>
                        {category.segment && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                            {category.segment}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-600">
                No categories match “{searchQuery}”.
              </p>
            </div>
          )}
        </div>

        {/* Product Modal */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
}
