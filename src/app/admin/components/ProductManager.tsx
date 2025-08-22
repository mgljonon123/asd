"use client";

import { useState, useEffect } from "react";
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
  // Technical specifications
  resolution?: string;
  nightVision?: string;
  weatherProtection?: string;
  storage?: string;
  power?: string;
  warranty?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  type: "CAMERA" | "ALARM";
  segment?: "RESIDENTIAL" | "COMPANY";
}

interface Company {
  id: string;
  name: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<HomePageProduct | null>(null);
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
    resolution: "4K Ultra HD",
    nightVision: "Up to 100m",
    weatherProtection: "IP67 Rated",
    storage: "Up to 128GB",
    power: "12V DC / PoE",
    warranty: "2 Years",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "CAMERA" | "ALARM">(
    "ALL"
  );
  const [filterSegment, setFilterSegment] = useState<
    "ALL" | "RESIDENTIAL" | "COMPANY"
  >("ALL");
  const [filterStock, setFilterStock] = useState<
    "ALL" | "AVAILABLE" | "OUT_OF_STOCK"
  >("ALL");

  // Debug form data changes
  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch categories, companies, products from API
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
      setProducts(
        (prodData as any[]).map((p) => ({
          ...p,
          // Ensure types align with UI interface
          price: Number(p.price),
        })) as Product[]
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData);
    console.log("Form validation starting...");

    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price <= 0 ||
      !formData.companyId
    ) {
      alert("Please fill in all required fields");
      console.log("Validation failed:", {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        segment: formData.segment,
        companyId: formData.companyId,
      });
      return;
    }

    console.log("Validation passed, processing form...");

    // Resolve category by type + segment; create if missing
    let selectedCategory = categories.find(
      (c) => c.type === formData.type && c.segment === formData.segment
    );
    if (!selectedCategory) {
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${formData.type} - ${formData.segment}`,
            description: `${
              formData.segment
            } ${formData.type.toLowerCase()} category`,
            type: formData.type,
            segment: formData.segment,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          selectedCategory = created as Category;
          setCategories((prev) => [created as Category, ...prev]);
        }
      } catch (e) {
        console.error("Failed to auto-create category", e);
      }
    }
    const selectedCompany = companies.find((c) => c.id === formData.companyId);

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            tags: formData.tags,
            images: formData.images,
          }),
        });
        if (!res.ok) throw new Error("Failed to update product");
        const updated: Product = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            tags: formData.tags,
            images: formData.images,
          }),
        });
        if (!res.ok) throw new Error("Failed to create product");
        const created: Product = await res.json();
        setProducts((prev) => [created, ...prev]);
      }
    } catch (error) {
      console.error(error);
      alert("Operation failed. See console for details.");
      return;
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags.join(", "),
      type: product.type,
      segment: (product as any).category?.segment || "RESIDENTIAL",
      companyId: product.companyId,
      images: product.images.join(", "),
      inStock: product.inStock,
      stockStatus: product.stockStatus,
      resolution: product.resolution ?? "",
      nightVision: product.nightVision ?? "",
      weatherProtection: product.weatherProtection ?? "",
      storage: product.storage ?? "",
      power: product.power ?? "",
      warranty: product.warranty ?? "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Delete failed. See console for details.");
    }
  };

  const resetForm = () => {
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
      resolution: "4K Ultra HD",
      nightVision: "Up to 100m",
      weatherProtection: "IP67 Rated",
      storage: "Up to 128GB",
      power: "12V DC / PoE",
      warranty: "2 Years",
    });
    setEditingProduct(null);
  };

  const showSampleProduct = (productType: "camera" | "alarm") => {
    let sampleProduct: HomePageProduct;

    if (productType === "camera") {
      sampleProduct = {
        id: 1,
        name: "HD Dome Camera Pro",
        price: 450000,
        originalPrice: 550000,
        description:
          "1080p HD resolution with night vision and motion detection",
        features: ["1080p HD", "Night Vision", "Motion Detection"],
        badge: "Best Seller",
        badgeColor: "teal",
      };
    } else {
      sampleProduct = {
        id: 2,
        name: "Smart Alarm System",
        price: 850000,
        originalPrice: 950000,
        description:
          "Intelligent alarm system with mobile app control and real-time alerts",
        features: ["Mobile App", "Real-time Alerts", "Smart Detection"],
        badge: "New",
        badgeColor: "red",
      };
    }

    setSelectedProduct(sampleProduct);
    setIsProductModalOpen(true);
  };

  const getStockStatusColor = (status: "AVAILABLE" | "OUT_OF_STOCK") => {
    return status === "AVAILABLE"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getTypeColor = (type: "CAMERA" | "ALARM") => {
    return type === "CAMERA"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  // Derived: filtered products for search and filters
  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.tags.join(" ").toLowerCase().includes(q);
    const matchesType = filterType === "ALL" || product.type === filterType;
    const matchesStock =
      filterStock === "ALL" || product.stockStatus === filterStock;
    const matchesSeg =
      filterSegment === "ALL" ||
      (product as any).category?.segment === filterSegment;
    return matchesSearch && matchesType && matchesStock && matchesSeg;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Manage Products
          </h2>
          <p className="text-gray-600">
            Add, edit, and manage your product catalog
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-2 sm:items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, tags or description..."
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
            <select
              value={filterStock}
              onChange={(e) =>
                setFilterStock(
                  e.target.value as "ALL" | "AVAILABLE" | "OUT_OF_STOCK"
                )
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-black"
            >
              <option value="ALL">All Stock</option>
              <option value="AVAILABLE">Available</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </DialogTrigger>
              {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <DialogContent className="sm:max-w-2xl w-full max-w-2xl bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                    <div className="mb-4">
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Product Name
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
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Price
                          </label>
                          <input
                            type="number"
                            id="price"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: parseFloat(e.target.value),
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
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

                      <div className="grid grid-cols-2 gap-5">
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
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="RESIDENTIAL">Residential</option>
                            <option value="COMPANY">Company</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="companyId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Company
                        </label>
                        <select
                          id="companyId"
                          value={formData.companyId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyId: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Company</option>
                          {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="tags"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            id="tags"
                            value={formData.tags}
                            onChange={(e) =>
                              setFormData({ ...formData, tags: e.target.value })
                            }
                            placeholder="HD, Night Vision, Wireless"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="images"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Product Images
                          </label>
                          <input
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;
                              const data = new FormData();
                              Array.from(files).forEach((f) =>
                                data.append("files", f)
                              );
                              try {
                                const res = await fetch("/api/upload", {
                                  method: "POST",
                                  body: data,
                                });
                                if (!res.ok) throw new Error("Upload failed");
                                const json = await res.json();
                                const urls: string[] = json.urls || [];
                                setFormData((prev) => ({
                                  ...prev,
                                  images: urls.join(", "),
                                }));
                              } catch (err) {
                                console.error(err);
                                alert("Image upload failed");
                              }
                            }}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          {formData.images && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {formData.images
                                .split(",")
                                .map((u) => u.trim())
                                .filter(Boolean)
                                .map((u, idx) => (
                                  <img
                                    key={idx}
                                    src={u}
                                    alt="upload preview"
                                    className="h-14 w-14 object-cover rounded border"
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="stockStatus"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Stock Status
                          </label>
                          <select
                            id="stockStatus"
                            value={formData.stockStatus}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                stockStatus: e.target.value as
                                  | "AVAILABLE"
                                  | "OUT_OF_STOCK",
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="AVAILABLE">Available</option>
                            <option value="OUT_OF_STOCK">Out of Stock</option>
                          </select>
                        </div>
                        <div className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            id="inStock"
                            checked={formData.inStock}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                inStock: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="inStock"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            In Stock
                          </label>
                        </div>
                      </div>

                      {/* Technical Specifications */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">
                          Technical Specs
                        </h4>
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <label
                              htmlFor="resolution"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Нягтаршил
                            </label>
                            <input
                              type="text"
                              id="resolution"
                              value={formData.resolution}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  resolution: e.target.value,
                                })
                              }
                              placeholder="4K Ultra HD"
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="nightVision"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Шөнийн хараа
                            </label>
                            <input
                              type="text"
                              id="nightVision"
                              value={formData.nightVision}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  nightVision: e.target.value,
                                })
                              }
                              placeholder="Up to 100m"
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="weatherProtection"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Цаг агаарын хамгаалалт
                            </label>
                            <input
                              type="text"
                              id="weatherProtection"
                              value={formData.weatherProtection}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  weatherProtection: e.target.value,
                                })
                              }
                              placeholder="IP67 Rated"
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="storage"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Санах ой
                            </label>
                            <input
                              type="text"
                              id="storage"
                              value={formData.storage}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  storage: e.target.value,
                                })
                              }
                              placeholder="Up to 128GB"
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="power"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Тэжээл
                            </label>
                            <input
                              type="text"
                              id="power"
                              value={formData.power}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  power: e.target.value,
                                })
                              }
                              placeholder="12V DC / PoE"
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="warranty"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Баталгаа
                            </label>
                            <input
                              type="text"
                              id="warranty"
                              value={formData.warranty}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  warranty: e.target.value,
                                })
                              }
                              placeholder="2 Years"
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 mt-2 py-4">
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
                          {editingProduct ? "Update" : "Create"}
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </div>
              )}
            </Dialog>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} of {products.length} products
            </div>
            <div className="hidden md:block text-xs text-gray-400">
              Responsive grid: 1–4 columns
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute right-3 top-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-md bg-white/90 border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-md bg-white/90 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {Array.isArray(product.images) &&
                      product.images.length > 0 ? (
                        <Image
                          src={
                            typeof product.images[0] === "string"
                              ? product.images[0].startsWith("http") ||
                                product.images[0].startsWith("/") ||
                                product.images[0].startsWith("data:")
                                ? product.images[0]
                                : `/${product.images[0].replace(/^\/+/, "")}`
                              : ""
                          }
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-cover w-16 h-16"
                        />
                      ) : (
                        <Package className="h-7 w-7 text-blue-600" />
                      )}
                    </div>
                    <div className="min-w-0 w-full">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                            product.type
                          )}`}
                        >
                          {product.type}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(
                            product.stockStatus
                          )}`}
                        >
                          {product.stockStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
                        <span className="inline-flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="font-medium">${product.price}</span>
                        </span>
                        <span className="inline-flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          <span className="font-medium">
                            {product.category.name}
                          </span>
                          {(product as any).category?.segment && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 border">
                              {(product as any).category.segment}
                            </span>
                          )}
                        </span>
                        <span className="inline-flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="font-medium">
                            {product.company.name}
                          </span>
                        </span>
                      </div>
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No matches
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting filters or search.
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
