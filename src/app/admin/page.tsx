"use client";

import { useState } from "react";
import ProductManager from "./components/ProductManager";
import CategoryManager from "./components/CategoryManager";
import CompanyManager from "./components/CompanyManager";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "companies">("products");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Админ самбар</h1>
          <p className="text-gray-600 mt-1">Бүтээгдэхүүн, ангилал, компаниудыг удирдах</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeTab === "products"
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-black border-transparent"
                : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
            }`}
          >
            Бүтээгдэхүүн
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeTab === "categories"
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-black border-transparent"
                : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
            }`}
          >
            Ангиллууд
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeTab === "companies"
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-black border-transparent"
                : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
            }`}
          >
            Компаниуд
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
          {activeTab === "products" && <ProductManager />}
          {activeTab === "categories" && <CategoryManager />}
          {activeTab === "companies" && <CompanyManager />}
        </div>
      </div>
    </div>
  );
} 