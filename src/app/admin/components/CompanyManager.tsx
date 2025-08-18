"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import ProductModal from "../../components/ProductModal";
import { Product } from "../../types/product";

interface Company {
  id: string;
  name: string;
  contactInfo: string;
  phoneNumber: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    phoneNumber: "",
    location: "",
  });

  // Debug form data changes
  useEffect(() => {
    console.log("Company form data changed:", formData);
  }, [formData]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/companies", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch companies");
      const data: Company[] = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Company form submitted with data:", formData);
    console.log("Current companies:", companies);

    try {
      if (editingCompany) {
        const res = await fetch(`/api/companies/${editingCompany.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update company");
        const updated: Company = await res.json();
        setCompanies((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const res = await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to create company");
        const created: Company = await res.json();
        setCompanies((prev) => [created, ...prev]);
      }
    } catch (error) {
      console.error(error);
      alert("Operation failed. See console for details.");
      return;
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      contactInfo: company.contactInfo,
      phoneNumber: company.phoneNumber,
      location: company.location,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete company");
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      alert("Delete failed. See console for details.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contactInfo: "",
      phoneNumber: "",
      location: "",
    });
    setEditingCompany(null);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading companies...</div>
      </div>
    );
  }

  const filteredCompanies = companies.filter((company) => {
    const q = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(q) ||
      company.contactInfo.toLowerCase().includes(q) ||
      company.phoneNumber.toLowerCase().includes(q) ||
      company.location.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Manage Companies
            </h2>
            <p className="text-gray-600">
              Partners, distributors and suppliers
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, phone, location..."
                className="w-full sm:w-80 rounded-lg border border-gray-300 bg-white px-3 py-2 pl-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </button>
              </DialogTrigger>
              {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <DialogContent className="sm:max-w-md w-full max-w-md bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8">
                    <div className="mb-4">
                      <DialogTitle>
                        {editingCompany ? "Edit Company" : "Add New Company"}
                      </DialogTitle>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Company Name
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
                          htmlFor="contactInfo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Contact Info
                        </label>
                        <input
                          type="email"
                          id="contactInfo"
                          value={formData.contactInfo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactInfo: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
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
                          {editingCompany ? "Update" : "Create"}
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </div>
              )}
            </Dialog>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="group relative rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute right-3 top-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(company)}
                    className="p-2 rounded-md bg-white/90 border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="p-2 rounded-md bg-white/90 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 w-full">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {company.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                        <span className="inline-flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {company.contactInfo}
                        </span>
                        <span className="inline-flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {company.phoneNumber}
                        </span>
                        <span className="inline-flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {company.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCompanies.length === 0 && (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-600">
                No companies match “{searchQuery}”.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
