"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProductManager from "./components/ProductManager";
import CategoryManager from "./components/CategoryManager";
import CompanyManager from "./components/CompanyManager";
import { AdminDataProvider } from "./context/AdminDataContext";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "companies"
  >("products");
  const router = useRouter();
  
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    router.replace("/");
  }, [router]);

  const handleTabChange = useCallback((tab: "products" | "categories" | "companies") => {
    setActiveTab(tab);
  }, []);

  const tabButtons = useMemo(() => [
    { id: "products", label: "Бүтээгдэхүүн" },
    { id: "categories", label: "Ангиллууд" },
    { id: "companies", label: "Компаниуд" }
  ] as const, []);

  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Админ самбар</h1>
              <p className="text-gray-600 mt-1">
                Бүтээгдэхүүн, ангилал, компаниудыг удирдах
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600 transition"
            >
              Гарах
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {tabButtons.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  activeTab === id
                    ? "bg-gradient-to-r from-teal-500 to-blue-600 text-black border-transparent"
                    : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            {/* Keep all components mounted but control visibility */}
            <div className={activeTab === "products" ? "block" : "hidden"}>
              <ProductManager />
            </div>
            <div className={activeTab === "categories" ? "block" : "hidden"}>
              <CategoryManager />
            </div>
            <div className={activeTab === "companies" ? "block" : "hidden"}>
              <CompanyManager />
            </div>
          </div>
        </div>
      </div>
    </AdminDataProvider>
  );
}
